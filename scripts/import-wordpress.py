#!/usr/bin/env python3
"""Convert a WordPress WXR export into Astro blog markdown files."""

from __future__ import annotations

import html
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "wp": "http://wordpress.org/export/1.2/",
}


def tag(name: str, ns: str = "wp") -> str:
    return f"{{{NS[ns]}}}{name}"


def text(element: ET.Element | None) -> str:
    if element is None or element.text is None:
        return ""
    return element.text.strip()


def html_to_markdown(raw_html: str) -> str:
    cleaned = re.sub(r"<!--\s*/?wp:[^>]+-->", "", raw_html)
    cleaned = re.sub(r"<hr[^>]*>", "\n\n---\n\n", cleaned, flags=re.IGNORECASE)

    for level in range(6, 0, -1):
        cleaned = re.sub(
            rf"<h{level}[^>]*>(.*?)</h{level}>",
            lambda match, lvl=level: f"\n\n{'#' * lvl} {strip_tags(match.group(1)).strip()}\n\n",
            cleaned,
            flags=re.DOTALL | re.IGNORECASE,
        )

    cleaned = re.sub(
        r"<blockquote[^>]*>(.*?)</blockquote>",
        lambda match: f"\n\n> {blockquote_to_markdown(match.group(1))}\n\n",
        cleaned,
        flags=re.DOTALL | re.IGNORECASE,
    )
    cleaned = re.sub(
        r"<li[^>]*>(.*?)</li>",
        lambda match: f"\n- {strip_tags(match.group(1)).strip()}",
        cleaned,
        flags=re.DOTALL | re.IGNORECASE,
    )
    cleaned = re.sub(r"</?(ul|ol)[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(
        r"<p[^>]*>(.*?)</p>",
        lambda match: f"\n\n{inline_html_to_markdown(match.group(1)).strip()}\n",
        cleaned,
        flags=re.DOTALL | re.IGNORECASE,
    )
    cleaned = re.sub(r"<br\s*/?>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = strip_tags(cleaned)
    cleaned = html.unescape(cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def strip_tags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value)


def inline_html_to_markdown(value: str) -> str:
    value = re.sub(
        r"<strong[^>]*>(.*?)</strong>",
        r"**\1**",
        value,
        flags=re.DOTALL | re.IGNORECASE,
    )
    value = re.sub(
        r"<em[^>]*>(.*?)</em>",
        r"*\1*",
        value,
        flags=re.DOTALL | re.IGNORECASE,
    )
    value = re.sub(
        r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',
        lambda match: f"[{strip_tags(match.group(2)).strip()}]({match.group(1)})",
        value,
        flags=re.DOTALL | re.IGNORECASE,
    )
    return html.unescape(strip_tags(value))


def blockquote_to_markdown(value: str) -> str:
    text_value = inline_html_to_markdown(value).strip()
    return "\n> ".join(line for line in text_value.splitlines() if line.strip())


def first_paragraph(raw_html: str) -> str:
    match = re.search(r"<p[^>]*>(.*?)</p>", raw_html, re.DOTALL | re.IGNORECASE)
    if not match:
        return ""
    return inline_html_to_markdown(match.group(1)).strip()


def format_pub_date(date_str: str) -> str:
    parsed = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    return parsed.strftime("%b %d %Y")


def yaml_quote(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def write_post(output_dir: Path, item: ET.Element) -> None:
    title = text(item.find("title"))
    slug = text(item.find(tag("post_name")))
    status = text(item.find(tag("status")))
    post_type = text(item.find(tag("post_type")))
    post_date = text(item.find(tag("post_date")))
    content = text(item.find(f"{{{NS['content']}}}encoded"))

    if status != "publish" or post_type != "post" or not slug:
        return

    categories = [
        html.unescape(category.text.strip())
        for category in item.findall("category")
        if category.attrib.get("domain") == "category" and category.text
    ]
    categories = [name for name in categories if name.lower() != "uncategorized"]

    description = first_paragraph(content) or title
    markdown_body = html_to_markdown(content)
    pub_date = format_pub_date(post_date)

    frontmatter = [
        "---",
        f"title: {yaml_quote(title)}",
        f"description: {yaml_quote(description[:240])}",
        f"pubDate: '{pub_date}'",
    ]

    if categories:
        category_yaml = ", ".join(yaml_quote(name) for name in categories)
        frontmatter.append(f"categories: [{category_yaml}]")

    frontmatter.append("---")
    frontmatter.append("")

    output_path = output_dir / f"{slug}.md"
    output_path.write_text("\n".join(frontmatter) + markdown_body + "\n", encoding="utf-8")
    print(f"Wrote {output_path.name}")


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    export_path = repo_root / "imports" / "nutanixvibes.WordPress.2026-06-21.xml"
    output_dir = repo_root / "src" / "content" / "blog"
    output_dir.mkdir(parents=True, exist_ok=True)

    for existing in output_dir.glob("*.md"):
        existing.unlink()
    for existing in output_dir.glob("*.mdx"):
        existing.unlink()

    tree = ET.parse(export_path)
    root = tree.getroot()
    channel = root.find("channel")
    if channel is None:
        raise SystemExit("No channel found in WordPress export.")

    for item in channel.findall("item"):
        write_post(output_dir, item)


if __name__ == "__main__":
    main()
