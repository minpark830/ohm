# Ohm

Electrical engineering interview practice: circuit analysis, RC circuits, BJT, MOSFET, digital logic and HDL.

**Practice:** https://minpark830.github.io/ohm/

This repository contains the public browser interface. Published problems, hints, solutions and answer checking come from the existing Ohm API. No database exports, account data, runtime secrets or server code are included.

## Accounts and progress

Guest practice saves in this browser. GitHub sign-in creates a practice account directly on this website and saves private progress through the existing Ohm backend. Guest progress imports only with your explicit choice. Problem reports open the existing feedback form. Owner tools are available only through a separate, server-authorized entrance; public navigation does not advertise them.

Browser sign-in storage shares the minpark830.github.io origin with other project sites; path names and storage prefixes do not isolate projects. Only publish trusted code on this origin. No GitHub repository permissions are requested.

## Publishing

GitHub Pages publishes the main branch, root folder. The files are generated from Ohm's maintained source with npm run build:pages. To update this interface, upload the generated files from .local/pages-release after testing. Public problem edits appear through the API without republishing this repository.

The simulations are educational circuit models; the HDL checker supports limited one-bit combinational expressions, not a full Verilog simulator.
