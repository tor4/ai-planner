"""Build tokens.css from tokens.json. Run: python3 docs/design/design-system/build.py"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
t = json.load(open(os.path.join(HERE, "tokens.json")))


def val(x):
    m = re.fullmatch(r"\{(.+)\}", x)
    return f"var(--{m.group(1)})" if m else x


themes = [th["id"] for th in t["color"]["themes"]]


def colors(theme):
    return "".join(f"\n  --{c['name']}: {val(c['value'][theme])};" for c in t["color"]["tokens"])


out = [f"/* {t['name']} — generated from tokens.json by build.py. Do not edit by hand. */"]
out.append(f":root, [data-theme=\"{themes[0]}\"] {{{colors(themes[0])}\n}}")
for th in themes[1:]:
    out.append(f"[data-theme=\"{th}\"] {{{colors(th)}\n}}")
    out.append(f"@media (prefers-color-scheme: {th}) {{\n  :root:not([data-theme]) {{{colors(th).replace(chr(10), chr(10) + '  ')}\n  }}\n}}")
rest = "".join(f"\n  --{x['name']}: {x['value']};" for fam in ("spacing", "radius", "size") for x in t[fam]["tokens"])
rest += "".join(f"\n  --font-{k}: {v};" for k, v in t["type"]["families"].items())
out.append(f":root {{{rest}\n}}")
for g in t["type"]["groups"]:
    for s in g["styles"]:
        fam = s.get("family", g["family"])
        decl = f"font-family: var(--font-{fam}); font-size: {s['fontSize']}; line-height: {s['lineHeight']}; font-weight: {s['fontWeight']};"
        if "letterSpacing" in s:
            decl += f" letter-spacing: {s['letterSpacing']};"
        out.append(f".type-{s['name']} {{ {decl} }}")
open(os.path.join(HERE, "tokens.css"), "w").write("\n".join(out) + "\n")
print("wrote tokens.css")
