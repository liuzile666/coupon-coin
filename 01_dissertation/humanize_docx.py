# -*- coding: utf-8 -*-
"""
Humanize a docx in-place by rewriting all <w:t> text runs to reduce AI signals.

Pipeline:
  1. Read docx (zip), extract word/document.xml
  2. Walk every <w:t>...</w:t> text run
  3. Apply transform rules (em-dash -> comma, copula avoid, fillers, AI vocab,
     significance inflation, em-dash reduction, negative parallelism dampen,
     rule-of-three breakup, mild lexical variation)
  4. Repack zip
"""
import os, re, sys, json, shutil, zipfile, random
from pathlib import Path
import xml.etree.ElementTree as ET

random.seed(42)  # deterministic so reruns are stable

PATTERNS = json.loads(Path("/Users/aiden/.workbuddy/skills/humanize-ai-text/scripts/patterns.json").read_text())

# ---- Replacement maps ------------------------------------------------------

COPULA = PATTERNS["copula_avoidance"]
FILLER = PATTERNS["filler_replacements"]

# Extra hand-tuned replacements: AI-flavoured academic vocabulary -> plainer
EXTRA = {
    # academic AI puffery
    "in excess of": "more than",
    "approximately": "about",
    "in conjunction with": "alongside",
    "in accordance with": "following",
    "with respect to": "for",
    "with regard to": "for",
    "in the context of": "in",
    "the present Capstone": "this Capstone",
    "the present work": "this work",
    "the present dissertation": "this dissertation",
    "the present report": "this report",
    "the present chapter": "this chapter",
    "the present study": "this study",
    "the present analysis": "this analysis",
    "the present author": "I",
    "the author's": "my",
    "the author wishes to": "I want to",
    "the author thanks": "I thank",
    "the author further extends": "I also extend",
    "the author also thanks": "I also thank",
    "the author acknowledges": "I acknowledge",
    "the author judges": "I judge",
    "the author submits": "I think",
    "Whilst": "While",
    "whilst": "while",
    "amongst": "among",
    "shall": "will",
    "hence": "so",
    "thus": "so",
    "thereby": "and",
    "wherein": "where",
    "thereof": "of it",
    "henceforth": "from now on",
    "notwithstanding": "even so",
    "subsequently": "later",
    "consequently": "so",
    "moreover": "also",
    "Moreover,": "Also,",
    "furthermore": "and",
    "Furthermore,": "And",
    "additionally": "also",
    "Additionally,": "Also,",
    "in addition": "also",
    "In addition,": "Also,",
    "Nevertheless,": "Still,",
    "nevertheless": "still",
    # significance inflation
    "stands as": "is",
    "serves as": "is",
    "constitutes": "is",
    "constitute": "are",
    "constituting": "being",
    "encompass": "cover",
    "encompasses": "covers",
    "encompassing": "covering",
    "exhibit": "show",
    "exhibits": "shows",
    "exhibits a": "shows a",
    "exhibits an": "shows an",
    "demonstrate": "show",
    "demonstrates": "shows",
    "demonstrated": "shown",
    "delineate": "describe",
    "delineates": "describes",
    "articulate": "lay out",
    "articulates": "lays out",
    "articulated": "laid out",
    "articulation": "framing",
    "elucidate": "explain",
    "elucidates": "explains",
    "comprises": "has",
    "comprise": "have",
    "comprising": "with",
    "encompass the": "cover the",
    "underpinning": "behind",
    "underpins": "supports",
    "underscoring": "showing",
    "underscored": "shown",
    "highlights the": "shows the",
    "highlighting the": "showing the",
    # AI tone words
    "leverage": "use",
    "leverages": "uses",
    "leveraging": "using",
    "utilize": "use",
    "utilizes": "uses",
    "utilizing": "using",
    "utilization": "use",
    "facilitate": "help",
    "facilitates": "helps",
    "facilitating": "helping",
    "optimize": "improve",
    "optimizes": "improves",
    "optimized": "improved",
    "optimization": "tuning",
    "robust": "solid",
    "robustness": "stability",
    "scalable": "able to scale",
    "scalability": "the ability to scale",
    "comprehensive": "full",
    "comprehensively": "fully",
    "holistic": "whole-system",
    "paradigm": "model",
    "paradigm shift": "real shift",
    "synergy": "fit",
    "synergistic": "complementary",
    "intricate": "complex",
    "intricacies": "details",
    "nuanced": "subtle",
    "multifaceted": "many-sided",
    "pivotal": "critical",
    "pivotal moment": "turning point",
    "intersection": "overlap",
    "tapestry": "mix",
    "rich tapestry": "mix",
    "evolving landscape": "changing field",
    "the landscape": "the field",
    "indelible mark": "lasting mark",
    "endeavor": "effort",
    "endeavour": "effort",
    "embark": "set out",
    "garner": "win",
    "garnered": "won",
    "is paramount": "matters most",
    "is of paramount importance": "matters most",
    # process-y verbs that scream AI
    "implement": "build",
    "implements": "builds",
    "implemented": "built",
    "implementation": "build",
    "operationalize": "put into practice",
    "operationalise": "put into practice",
    "instantiate": "create",
    "instantiates": "creates",
    "instantiated": "created",
    "instantiation": "concrete example",
    "iterate": "loop",
    "iterates": "loops",
    "iteration": "round",
    # heavy adverbs
    "particularly": "especially",
    "specifically": "in particular",
    "primarily": "mostly",
    "exclusively": "only",
    "predominantly": "mostly",
    "extensively": "widely",
    "significantly": "a lot",
    "substantially": "a lot",
    "ultimately": "in the end",
    "essentially": "basically",
    "fundamentally": "at root",
    "inherently": "by nature",
    "explicitly": "clearly",
    "implicitly": "implied",
    # "in order to"
    "in order to": "to",
    "due to the fact that": "because",
    # "a number of"
    "a number of": "several",
    "the number of": "how many",
    # softeners
    "it is important to note that ": "",
    "It is important to note that ": "",
    "it is worth noting that ": "",
    "It is worth noting that ": "",
    "it should be noted that ": "",
    "It should be noted that ": "",
    # AI loves "drives" / "is driven by"
    "is driven by": "comes from",
    "are driven by": "come from",
    "driven by": "from",
    # banal connectives
    "Specifically,": "",
    "More specifically,": "",
    "In particular,": "",
    # "key" overuse — major Wikipedia-flagged AI vocab
    "key role": "central role",
    "key moment": "turning point",
    "key economic": "main economic",
    "key custodians": "main custodians",
    "key turning point": "turning point",
    "key functions": "main functions",
    "key management": "key management",  # leave technical term alone
    "the key": "the main",
    "a key": "a main",
    "key insight": "main insight",
    "key idea": "main idea",
    "key feature": "core feature",
    "key features": "core features",
    "key challenges": "main challenges",
    "key takeaway": "takeaway",
    "key benefits": "main benefits",
    "key reason": "main reason",
    "key reasons": "main reasons",
    "key dimensions": "main dimensions",
    "key economic parameters": "main economic parameters",
    # banal "innovative"
    "innovative": "new",
    "innovation": "new approach",
    # other AI tells
    "Notwithstanding the": "Even with the",
    "notwithstanding the": "even with the",
    # "ameliorate"
    "ameliorated": "improved",
    "ameliorate": "improve",
    # Avoid "there is a" — false-positive trigger of chatbot detector
    "There is a second token": "A second token sits alongside CPC",
    "There is a five-contract suite": "A five-contract suite",
    "There is a 24-hour challenge": "A 24-hour challenge window",
    "And there is a three-layer": "And finally, a three-layer",
    # Negative parallelism / meta-narration sentence starts
    "It is worth pausing": "Worth pausing",
    "It is reasonable to ask": "A fair question",
    "It is economically sustainable": "Economically sustainable",
    "It is regulatorily defensible": "Regulatorily defensible",
    "It is technically feasible": "Technically feasible",
    "not just adding noise": "more than window dressing",
    "is not just rhetorical": "is more than rhetorical",
    # AI tells around academic puffery
    "deliberately conservative": "intentionally cautious",
    "deliberately understated": "intentionally cautious",
    "explicitly conservative": "intentionally cautious",
    "deemed": "judged",
    "the broader landscape": "the broader field",
    "evolving landscape": "shifting field",
    # Avoid Solidity ** (markdown false positive)
    "10**6": "10^6",
    "10**18": "10^18",
}

# Swap em-dashes (used as parentheticals) -> comma. Keep first 2-3 as natural.
EM_DASH_PROB_KEEP = 0.0  # zero em-dashes — humanizer-enhanced rule HIGH

# Words that, when present in a paragraph, slightly tweak punctuation
PARAGRAPH_FILLER_DROP = [
    r"\bAdditionally,\s*", r"\bFurthermore,\s*", r"\bMoreover,\s*",
    r"\bConsequently,\s*", r"\bSubsequently,\s*", r"\bHenceforth,\s*",
]

# ---- Helpers ---------------------------------------------------------------

def case_aware_replace(text, old, new):
    """Replace `old` with `new`, trying to preserve sentence-initial caps."""
    def _sub(m):
        match = m.group(0)
        if match[:1].isupper() and new and new[:1].islower():
            return new[:1].upper() + new[1:]
        return new
    return re.sub(r"\b" + re.escape(old) + r"\b", _sub, text, flags=re.IGNORECASE)

def apply_map(text, mapping):
    for old, new in mapping.items():
        if " " in old:
            text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)
        else:
            text = case_aware_replace(text, old, new)
    return text

def reduce_em_dashes(text):
    """Replace most em-dashes with commas, keep some for natural variation."""
    out = []
    parts = re.split(r"(\s*—\s*)", text)
    for p in parts:
        if re.fullmatch(r"\s*—\s*", p):
            if random.random() < EM_DASH_PROB_KEEP:
                out.append(" — ")
            else:
                out.append(", ")
        else:
            out.append(p)
    return "".join(out)

def soften_negative_parallelism(text):
    # "not only X but also Y" -> "X and Y"
    text = re.sub(r"\bnot only\b\s+(.+?)\s+\bbut also\b\s+", r"\1 and ", text, flags=re.IGNORECASE)
    text = re.sub(r"\bnot just\b\s+(.+?)\s+\bbut\b\s+", r"\1 but ", text, flags=re.IGNORECASE)
    return text

def vary_sentence_starts(text):
    # If a paragraph starts with one of these, drop it
    for pat in PARAGRAPH_FILLER_DROP:
        text = re.sub(pat, "", text)
    return text

def collapse_double_spaces(text):
    text = re.sub(r"  +", " ", text)
    text = re.sub(r"\s+,", ",", text)
    text = re.sub(r",\s*,", ",", text)
    return text

# Contractions — strong human signal. Apply only mid-sentence, not in formal headings.
CONTRACTIONS = [
    (r"\bit is\b", "it's"),
    (r"\bIt is\b", "It's"),
    (r"\bthat is\b", "that's"),
    (r"\bThat is\b", "That's"),
    (r"\bthere is\b", "there's"),
    (r"\bThere is\b", "There's"),
    (r"\bdo not\b", "don't"),
    (r"\bDo not\b", "Don't"),
    (r"\bdoes not\b", "doesn't"),
    (r"\bDoes not\b", "Doesn't"),
    (r"\bdid not\b", "didn't"),
    (r"\bDid not\b", "Didn't"),
    (r"\bcannot\b", "can't"),
    (r"\bCannot\b", "Can't"),
    (r"\bwill not\b", "won't"),
    (r"\bWill not\b", "Won't"),
    (r"\bwould not\b", "wouldn't"),
    (r"\bWould not\b", "Wouldn't"),
    (r"\bshould not\b", "shouldn't"),
    (r"\bShould not\b", "Shouldn't"),
    (r"\bis not\b", "isn't"),
    (r"\bIs not\b", "Isn't"),
    (r"\bare not\b", "aren't"),
    (r"\bAre not\b", "Aren't"),
    (r"\bwas not\b", "wasn't"),
    (r"\bWas not\b", "Wasn't"),
    (r"\bwere not\b", "weren't"),
    (r"\bWere not\b", "Weren't"),
    (r"\bhave not\b", "haven't"),
    (r"\bHave not\b", "Haven't"),
    (r"\bhas not\b", "hasn't"),
    (r"\bHas not\b", "Hasn't"),
    (r"\bI am\b", "I'm"),
    (r"\bI have\b", "I've"),
    (r"\bI will\b", "I'll"),
    (r"\bI would\b", "I'd"),
]

def apply_contractions(text):
    # Be selective: skip if text is short (likely a heading or label)
    if len(text) < 60:
        return text
    # Apply to ~70% of matches randomly so we don't over-contract
    for pat, sub in CONTRACTIONS:
        def _maybe(m):
            return sub if random.random() < 0.7 else m.group(0)
        text = re.sub(pat, _maybe, text)
    return text

def humanize(text):
    if not text or not text.strip():
        return text
    original = text
    # Order matters
    text = apply_map(text, EXTRA)
    text = apply_map(text, COPULA)
    text = apply_map(text, FILLER)
    text = soften_negative_parallelism(text)
    text = reduce_em_dashes(text)
    text = vary_sentence_starts(text)
    text = apply_contractions(text)
    text = collapse_double_spaces(text)
    return text

# ---- Docx surgery ----------------------------------------------------------

def process_docx(input_path, output_path):
    tmp_dir = Path("/tmp/docx_humanize_work")
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir()
    with zipfile.ZipFile(input_path, "r") as zin:
        zin.extractall(tmp_dir)

    doc_xml_path = tmp_dir / "word" / "document.xml"
    xml = doc_xml_path.read_text(encoding="utf-8")

    # Replace each <w:t ...>...</w:t> body. We don't touch attributes, so we can
    # use a regex without disturbing xml:space="preserve".
    pattern = re.compile(r'(<w:t(?:\s[^>]*)?>)([^<]*)(</w:t>)')

    changed = [0, 0]  # (changed_runs, total_runs)
    def _repl(m):
        changed[1] += 1
        body_in = m.group(2)
        # XML escape: input may contain &amp; etc. Only handle ampersand to avoid breaking refs.
        body_unescaped = body_in.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
        body_new = humanize(body_unescaped)
        if body_new != body_unescaped:
            changed[0] += 1
        body_escaped = body_new.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        return m.group(1) + body_escaped + m.group(3)

    new_xml = pattern.sub(_repl, xml)
    doc_xml_path.write_text(new_xml, encoding="utf-8")

    # Repack
    if Path(output_path).exists():
        Path(output_path).unlink()
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zout:
        for root, _, files in os.walk(tmp_dir):
            for f in files:
                full = Path(root) / f
                arc = full.relative_to(tmp_dir)
                zout.write(full, arc.as_posix())

    print(f"Runs touched: {changed[0]} / {changed[1]}")
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "/Users/aiden/Desktop/Coupon_Coin_Final_Report_HKU.docx"
    dst = sys.argv[2] if len(sys.argv) > 2 else src
    process_docx(src, dst)
