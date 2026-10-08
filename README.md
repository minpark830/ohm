# Ohm

Electrical engineering interview practice: circuit analysis, RC circuits, BJT, MOSFET, digital logic and HDL.

**Practice:** https://minpark830.github.io/ohm/

This repository contains the public browser interface. Published problems, hints, solutions and answer checking come from the existing Ohm API. No database exports, account data, runtime secrets or server code are included.

## Accounts and progress

Guest practice saves in this browser on this origin. Signed-in practice and existing cloud progress are available at https://ohm-ee-practice.minwoopark2016.chatgpt.site/#account. Guest progress does not automatically transfer between the two addresses. Reports and owner tools open the existing hosted workspace.

## Publishing

GitHub Pages publishes the main branch, root folder. The files are generated from Ohm's maintained source with npm run build:pages. To update this interface, upload the generated files from .local/pages-release after testing. Public problem edits appear through the API without republishing this repository.

The simulations are educational circuit models; the HDL checker supports limited one-bit combinational expressions, not a full Verilog simulator.
