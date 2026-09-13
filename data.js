/* Plan content: Fall 2026, University of Guelph. */
(function () {
  "use strict";
  var COURSES = [
    { key: "c1050", code: "CHEM*1050", name: "General Chemistry II", folder: "CHEM1050" },
    { key: "c2700", code: "CHEM*2700", name: "Organic Chemistry I", folder: "CHEM2700" },
    { key: "c2580", code: "BIOC*2580", name: "Introduction to Biochemistry", folder: "BIOC2580" },
    { key: "c1500", code: "IPS*1500", name: "Integrated Mathematics and Physics I", folder: "IPS1500" }
  ];

  var WEEKS = [
    { n: 1, start: "2026-09-10", end: "2026-09-20", short: "Sep 10", dates: "Thu Sep 10 – Sun Sep 20",
      note: "Classes start Thu Sep 10. Last day to add a course: Fri Sep 18.",
      tasks: {
        c1050: { t: "Energy, heat and enthalpy", r: [["Chem 2e", "§5.1–5.3"]], d: "Ch. 5 odd-numbered exercises on calorimetry and Hess’s law. Check each answer in the key at the back." },
        c2700: { t: "Bonding, resonance and acid–base strength", r: [["OChem", "Ch. 1 (skim), §2.1–2.11"], ["Soderberg", "Ch. 7"]], d: "Rank ten acids by strength, then predict which way each acid–base reaction goes from pKa values." },
        c2580: { t: "Foundations: water, pH and buffers", r: [["FoB", "Ch. 1–2"], ["BFFA", "Ch. 1"]], d: "Henderson–Hasselbalch problems: the pH of a buffer, and the ratio you need to reach a target pH." },
        c1500: { t: "Functions, units and vectors", r: [["Calc 1", "§1.2–1.5"], ["UPhys 1", "§1.2–1.4, Ch. 2"], ["A&T", "Ch. 7–9 if trig is rusty"]], d: "Check five physics formulas by dimensional analysis; resolve ten vectors into x and y components." }
      },
      link: { c: ["c1050", "c1500"], x: "The Δ in ΔH and the Δ in Δx mean the same thing in both courses: final value minus initial value." }
    },
    { n: 2, start: "2026-09-21", end: "2026-09-27", short: "Sep 21", dates: "Mon Sep 21 – Sun Sep 27",
      tasks: {
        c1050: { t: "Spontaneity and entropy", r: [["Chem 2e", "§16.1–16.2"]], d: "Predict the sign of ΔS for ten reactions before calculating anything, then check with standard entropies." },
        c2700: { t: "Functional groups, alkanes and conformations", r: [["OChem", "§3.1–3.7, §4.1–4.8"], ["Soderberg", "Ch. 3"]], d: "Newman projections for butane; both chair forms for five substituted cyclohexanes, circling the more stable one." },
        c2580: { t: "Amino acids and peptides", r: [["FoB", "Ch. 3"], ["BFFA", "Ch. 2"]], d: "Flashcards for all 20 amino acids: structure, three- and one-letter codes, and which side chains ionize." },
        c1500: { t: "Limits, and velocity as a limit", r: [["Calc 1", "§2.2–2.4"], ["UPhys 1", "§3.1–3.2"]], d: "Evaluate limits algebraically, then find an instantaneous velocity as the limit of average velocities." }
      },
      link: { c: ["c1500"], x: "Instantaneous velocity in UPhys §3.2 is the limit from Calc §2.2. It’s the same calculation in two books, which is why IPS*1500 teaches them together." }
    },
    { n: 3, start: "2026-09-28", end: "2026-10-04", short: "Sep 28", dates: "Mon Sep 28 – Sun Oct 4",
      tasks: {
        c1050: { t: "Second and third laws; Gibbs free energy", r: [["Chem 2e", "§16.3–16.4"]], d: "ΔG = ΔH − TΔS problems, including the temperature at which a reaction becomes spontaneous." },
        c2700: { t: "Stereochemistry: chirality, R/S and diastereomers", r: [["OChem", "Ch. 5"], ["Soderberg", "Ch. 3"]], d: "Assign R or S to fifteen stereocentres; pick out the meso compounds in a set of structures." },
        c2580: { t: "Three-dimensional protein structure", r: [["FoB", "Ch. 4"], ["BFFA", "Ch. 2"]], d: "Sketch the hydrogen bonds in an α-helix and a β-sheet; list the forces that hold tertiary structure together." },
        c1500: { t: "The derivative", r: [["Calc 1", "§3.1–3.4"], ["UPhys 1", "§3.3–3.5"]], d: "Differentiate x(t) to get v(t) and a(t); solve five free-fall problems." }
      },
      link: { c: ["c2700", "c2580"], x: "Nearly every amino acid in your proteins is L, which is S under this week’s rules. Cysteine is the exception (R), and glycine isn’t chiral at all." }
    },
    { n: 4, start: "2026-10-05", end: "2026-10-11", short: "Oct 5", dates: "Mon Oct 5 – Sun Oct 11",
      note: "Fall break starts after classes on Fri Oct 9.",
      tasks: {
        c1050: { t: "Free energy and equilibrium", r: [["Chem 2e", "§13.1–13.3 (review), §16.4"]], d: "Convert between K and ΔG° at 298 K, then write a one-page thermodynamics summary sheet." },
        c2700: { t: "Reading mechanisms: curved arrows and energy diagrams", r: [["OChem", "Ch. 6"], ["Soderberg", "Ch. 6"]], d: "Redraw every mechanism in Ch. 6 with curved arrows, labelling each nucleophile and electrophile." },
        c2580: { t: "Protein function: myoglobin and hemoglobin", r: [["FoB", "Ch. 5"]], d: "Compare the O₂-binding curves of myoglobin and hemoglobin, and explain the Bohr effect in your own words." },
        c1500: { t: "Differentiation rules", r: [["Calc 1", "§3.5–3.9"]], d: "Timed drill: 30 derivatives in 45 minutes — trig, chain rule, implicit, exponential and log." }
      },
      link: { c: ["c1050", "c2580"], x: "Proteins fold partly because burying nonpolar side chains frees ordered water. That positive ΔS makes ΔG negative: this week’s ΔG = ΔH − TΔS, inside a cell." }
    },
    { n: 5, start: "2026-10-12", end: "2026-10-18", short: "Oct 12", dates: "Mon Oct 12 – Sun Oct 18",
      note: "Fall break Mon Oct 12 – Tue Oct 13. Use it to catch up on anything unticked.",
      tasks: {
        c1050: { t: "Reaction rates", r: [["Chem 2e", "§12.1–12.2"]], d: "First, a closed-book 60-minute self-test from Ch. 5 and Ch. 16 exercises. Then start rates." },
        c2700: { t: "Nucleophilic substitution: SN2 and SN1", r: [["OChem", "§11.1–11.6, §7.9"], ["Soderberg", "Ch. 8"]], d: "Build a decision table — substrate, nucleophile, leaving group, solvent — and use it on 15 reactions." },
        c2580: { t: "Carbohydrates", r: [["FoB", "Ch. 7"], ["BFFA", "Ch. 2"]], d: "Draw D-glucose as a Fischer projection, then as α and β Haworth rings." },
        c1500: { t: "Motion in two dimensions", r: [["UPhys 1", "§4.1–4.4"], ["Calc 1", "§4.1"]], d: "Projectile range and height problems; three related-rates problems." }
      },
      link: { c: ["c2700", "c2580"], x: "D- and L-sugars are named from the stereocentre farthest from the carbonyl. Use Week 3’s chirality rules on glucose’s four stereocentres." }
    },
    { n: 6, start: "2026-10-19", end: "2026-10-25", short: "Oct 19", dates: "Mon Oct 19 – Sun Oct 25",
      tasks: {
        c1050: { t: "Rate laws", r: [["Chem 2e", "§12.3"]], d: "Method of initial rates: find the order in each reactant and the rate constant from data tables." },
        c2700: { t: "Elimination: E2, E1, and substitution vs elimination", r: [["OChem", "§11.7–11.11"]], d: "Twenty mixed problems: decide SN1, SN2, E1 or E2 first, then draw the major product." },
        c2580: { t: "Enzyme activity and kinetics", r: [["FoB", "Ch. 6"], ["BFFA", "Ch. 4"]], d: "Find Km and Vmax from a Lineweaver–Burk plot; tell competitive from non-competitive inhibition by the graph." },
        c1500: { t: "Newton’s laws of motion", r: [["UPhys 1", "Ch. 5"], ["Calc 1", "§4.3, §4.5"]], d: "Draw a free-body diagram before any algebra, for every problem this week." }
      },
      link: { c: ["c1050", "c2580"], x: "Michaelis–Menten is a rate law. At low [S] the rate is first order in substrate; at high [S] it’s zero order. Same vocabulary as Chem §12.3." }
    },
    { n: 7, start: "2026-10-26", end: "2026-11-01", short: "Oct 26", dates: "Mon Oct 26 – Sun Nov 1",
      tasks: {
        c1050: { t: "Integrated rate laws and half-life", r: [["Chem 2e", "§12.4"]], d: "Plot ln[A] and 1/[A] against time, in a spreadsheet or on graph paper, to decide the reaction order." },
        c2700: { t: "Alkenes and electrophilic addition", r: [["OChem", "§7.3–7.11"], ["Soderberg", "Ch. 14"]], d: "Predict Markovnikov products for ten additions, including two with carbocation rearrangements." },
        c2580: { t: "Enzyme mechanisms and regulation", r: [["FoB", "Ch. 6"], ["BFFA", "Ch. 4"]], d: "Write the chymotrypsin (serine protease) mechanism step by step and name the catalytic triad." },
        c1500: { t: "Applying Newton’s laws; antiderivatives", r: [["UPhys 1", "§6.1–6.3, §3.6"], ["Calc 1", "§4.10"]], d: "Inclined planes with friction; recover v(t) and x(t) from a(t) by antidifferentiating." }
      },
      link: { c: ["c1050", "c1500"], x: "The first-order integrated rate law comes from integrating d[A]/dt = −k[A]. You’ll meet that integral, ∫1/x dx = ln x, in Calc §5.6 in three weeks." }
    },
    { n: 8, start: "2026-11-02", end: "2026-11-08", short: "Nov 2", dates: "Mon Nov 2 – Sun Nov 8",
      tasks: {
        c1050: { t: "Collision theory, mechanisms and catalysis", r: [["Chem 2e", "§12.5–12.7"]], d: "Arrhenius two-point problems for activation energy; find the rate-determining step in three mechanisms." },
        c2700: { t: "Alkene reactions and synthesis", r: [["OChem", "§8.1–8.8, §9.3–9.5 (skim)"]], d: "One reaction card per alkene reaction: reagents, product, regiochemistry, stereochemistry." },
        c2580: { t: "Nucleotides and nucleic acids", r: [["FoB", "Ch. 8"], ["BFFA", "Ch. 2"]], d: "Draw a dinucleotide, show where the phosphodiester bond forms, and label the 5′ and 3′ ends." },
        c1500: { t: "Integration and the Fundamental Theorem", r: [["Calc 1", "§5.1–5.5"]], d: "Riemann-sum estimates first, then Fundamental Theorem and substitution drills." }
      },
      link: { c: ["c1050", "c2580"], x: "Enzymes are catalysts in exactly the §12.7 sense: they lower the activation energy and speed up both directions without changing ΔG or K." }
    },
    { n: 9, start: "2026-11-09", end: "2026-11-15", short: "Nov 9", dates: "Mon Nov 9 – Sun Nov 15",
      tasks: {
        c1050: { t: "Redox and galvanic cells", r: [["Chem 2e", "§4.2, §17.1–17.2"]], d: "Balance redox equations in acidic and basic solution; write cell notation for three galvanic cells." },
        c2700: { t: "Radical reactions", r: [["OChem", "§6.6, §10.2–10.4, §8.10"], ["Soderberg", "Ch. 16"]], d: "Write initiation, propagation and termination steps for radical bromination; predict the major product." },
        c2580: { t: "Lipids and membranes", r: [["FoB", "Ch. 10–11"], ["BFFA", "Ch. 3"]], d: "Table comparing simple diffusion, facilitated diffusion and active transport: energy source, direction, one example each." },
        c1500: { t: "Work and energy", r: [["UPhys 1", "Ch. 7, §8.1–8.3"], ["Calc 1", "§6.5"]], d: "Work done by a spring as an integral; five conservation-of-energy problems." }
      },
      link: { c: ["c1500", "c1050"], x: "Work in physics, W = ∫F dx, is the same w as in ΔU = q + w from Chem §5.3. For a gas pushing a piston, w = −PΔV." }
    },
    { n: 10, start: "2026-11-16", end: "2026-11-22", short: "Nov 16", dates: "Mon Nov 16 – Sun Nov 22",
      tasks: {
        c1050: { t: "Cell potential, free energy and equilibrium", r: [["Chem 2e", "§17.3–17.4"]], d: "E°cell from standard reduction potentials; connect it to ΔG° = −nFE° and to K; Nernst equation problems." },
        c2700: { t: "Aromaticity and electrophilic aromatic substitution", r: [["OChem", "§15.2–15.5, §16.1–16.5"], ["Soderberg", "Ch. 14"]], d: "Apply Hückel’s 4n + 2 rule to ten structures; classify substituents as ortho/para or meta directors." },
        c2580: { t: "Bioenergetics and glycolysis", r: [["FoB", "Ch. 12–13"], ["BFFA", "Ch. 5–6"]], d: "Write all ten glycolysis steps from memory with their enzymes; tally ATP and NADH." },
        c1500: { t: "Momentum and collisions", r: [["UPhys 1", "§9.1–9.6"], ["Calc 1", "§5.6, §6.1"]], d: "Elastic and inelastic collision problems; find a centre of mass." }
      },
      link: { c: ["c1050", "c2580"], x: "Glycolysis runs because unfavourable steps are coupled to ATP hydrolysis. Add the ΔG° values and the total turns negative: §16.4 applied to a whole pathway." }
    },
    { n: 11, start: "2026-11-23", end: "2026-11-29", short: "Nov 23", dates: "Mon Nov 23 – Sun Nov 29",
      tasks: {
        c1050: { t: "Batteries, corrosion and electrolysis", r: [["Chem 2e", "§17.5–17.7"]], d: "Faraday’s-law problems: the mass of metal plated from a current and a time." },
        c2700: { t: "Nucleophilic addition to aldehydes and ketones", r: [["OChem", "§19.4–19.8, §19.10, §19.12"], ["Soderberg", "Ch. 10"]], d: "Draw hydrate, imine and acetal formation mechanisms from memory." },
        c2580: { t: "The citric acid cycle", r: [["FoB", "Ch. 16 (Ch. 15 skim)"], ["BFFA", "Ch. 6"]], d: "Track acetyl-CoA’s two carbons through one turn; count the NADH, FADH₂ and GTP made." },
        c1500: { t: "Rotation and angular momentum", r: [["UPhys 1", "§10.1–10.7, §11.2–11.3"]], d: "Torque and moment-of-inertia problems; conservation of angular momentum for a spinning skater." }
      },
      link: { c: ["c2700", "c2580"], x: "Glucose closes into a ring by attacking its own carbonyl, forming a hemiacetal. It’s the same nucleophilic addition as OChem §19.10." }
    },
    { n: 12, start: "2026-11-30", end: "2026-12-06", short: "Nov 30", dates: "Mon Nov 30 – Sun Dec 6",
      note: "Classes end Fri Dec 4 (Thu runs a Tuesday schedule, Fri a Monday schedule). Last day to drop: Fri Dec 4.",
      tasks: {
        c1050: { t: "Put it together: ΔG, K, E° and k", r: [["Chem 2e", "Ch. 5, 12, 16, 17 summaries"]], d: "One formula sheet linking ΔG° = −RT ln K = −nFE°, then one timed 90-minute mixed problem set." },
        c2700: { t: "Nucleophilic acyl substitution", r: [["OChem", "§21.2–21.8, §20.3"], ["Soderberg", "Ch. 11"]], d: "Rank acid derivatives by reactivity; draw ester hydrolysis under acidic and basic conditions." },
        c2580: { t: "Oxidative phosphorylation and fatty-acid breakdown", r: [["FoB", "Ch. 19, Ch. 17 (Ch. 18 skim)"]], d: "ATP yield from one glucose; β-oxidation ATP tally for palmitate." },
        c1500: { t: "Special relativity and atomic structure", r: [["UPhys 3", "§5.1–5.4, §5.8–5.9, §8.1, §8.4"]], d: "Time-dilation and length-contraction calculations; rest energy from E = mc²." }
      },
      link: { c: ["c1050", "c2580"], x: "The electron transport chain works like a galvanic cell built into a membrane. ΔG° = −nFΔE° from Week 10 tells you how much energy each electron pair releases." }
    }
  ];

  var EXAM = { start: "2026-12-07", end: "2026-12-22", short: "Dec 7" };

  var SETUP = [
    { id: "setup-outlines", x: "Download each course outline from CourseLink and enter your midterm and exam dates in the Exams tab." },
    { id: "setup-hours", x: "Block about 24 hours a week in your calendar. The day plan in the Guide tab is a starting point." },
    { id: "setup-notes", x: "Start one notebook section or notes file per course, with a page for problems you got wrong." }
  ];

  var EXAM_TASKS = [
    { id: "sheet", x: "One-page summary sheet" },
    { id: "wrong", x: "Redo every problem marked wrong" },
    { id: "mock", x: "Timed mock exam, closed book" }
  ];

  var BOOKS = [
    ["Chem 2e", "Chemistry 2e (OpenStax)", "CHEM1050", "https://openstax.org/details/books/chemistry-2e"],
    ["OChem", "Organic Chemistry, 10th ed., McMurry (OpenStax)", "CHEM2700", "https://openstax.org/details/books/organic-chemistry"],
    ["Soderberg", "Organic Chemistry with a Biological Emphasis, Vol. I–II, plus two solutions files", "CHEM2700", "https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Book%3A_Organic_Chemistry_with_a_Biological_Emphasis_v2.0_(Soderberg)"],
    ["Roberts & Caserio", "Basic Principles of Organic Chemistry — a second explanation when a mechanism won’t click", "CHEM2700", "https://authors.library.caltech.edu/records/z1ms9-63w28"],
    ["FoB", "Fundamentals of Biochemistry (Jakubowski & Flatt). Ch. 1–11 are in Vol. I, Ch. 12–22 in Vol. II", "BIOC2580", "https://bio.libretexts.org/Bookshelves/Biochemistry/Fundamentals_of_Biochemistry_(Jakubowski_and_Flatt)"],
    ["BFFA", "Biochemistry Free For All (Ahern, Rajagopal & Tan)", "BIOC2580", "https://open.oregonstate.education/biochemfreeforall/"],
    ["Biology 2e", "Biology 2e (OpenStax) — optional background, Ch. 3, 6 and 7", "online only", "https://openstax.org/details/books/biology-2e"],
    ["Calc 1", "Calculus Volume 1 (OpenStax)", "IPS1500", "https://openstax.org/details/books/calculus-volume-1"],
    ["UPhys 1", "University Physics Volume 1 (OpenStax)", "IPS1500", "https://openstax.org/details/books/university-physics-volume-1"],
    ["UPhys 3", "University Physics Volume 3 (OpenStax)", "IPS1500", "https://openstax.org/details/books/university-physics-volume-3"],
    ["A&T", "Algebra and Trigonometry 2e (OpenStax) — refresher only", "IPS1500", "https://openstax.org/details/books/algebra-and-trigonometry-2e"]
  ];

  self.PLAN = { COURSES: COURSES, WEEKS: WEEKS, EXAM: EXAM, SETUP: SETUP, EXAM_TASKS: EXAM_TASKS, BOOKS: BOOKS };
})();
