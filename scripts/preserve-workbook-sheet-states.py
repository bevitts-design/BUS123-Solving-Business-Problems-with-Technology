#!/usr/bin/env python3
"""Preserve native sheet visibility omitted by the spreadsheet export runtime.

Usage: python3 preserve-workbook-sheet-states.py original.xlsx exported.xlsx
Only workbook.xml sheet visibility attributes are changed.
"""
import sys
import html
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

source, target = map(Path, sys.argv[1:3])
namespace = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
with zipfile.ZipFile(source) as archive:
    original = ET.fromstring(archive.read("xl/workbook.xml"))
states = {sheet.attrib["name"]: sheet.get("state", "visible")
          for sheet in original.find(namespace + "sheets")}
with zipfile.ZipFile(target) as archive:
    workbook = archive.read("xl/workbook.xml").decode("utf-8")
    # A minimal textual replacement preserves all namespace declarations,
    # including namespaces referenced by Excel's compatibility attributes.
    import re
    def preserve(match):
        tag = match.group()
        name = html.unescape(re.search(r'\bname="([^"]*)"', tag).group(1))
        state = states.get(name, "visible")
        tag = re.sub(r'\sstate="[^"]*"', "", tag)
        return tag.replace("/>", f' state="{state}"/>')
    workbook = re.sub(r'<(?:[A-Za-z_][\w.-]*:)?sheet\s[^>]+/>', preserve, workbook)
    members = [(item, archive.read(item.filename)) for item in archive.infolist()]
temporary = target.with_suffix(".visibility.tmp.xlsx")
with zipfile.ZipFile(temporary, "w") as archive:
    for item, content in members:
        archive.writestr(item, workbook.encode("utf-8") if item.filename == "xl/workbook.xml" else content)
temporary.replace(target)
