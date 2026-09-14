/* Review questions: five per weekly topic, each as [question, answer]. Keys match the weekly task ids. */
(function (root) {
  "use strict";
  root.QUESTIONS = {

    /* ---------------- Week 1 ---------------- */
    "w1-c1050": [
      ["How much heat is needed to warm 250 g of water from 20.0 °C to 80.0 °C? (c = 4.184 J/g·°C)",
       "q = mcΔT = 250 g × 4.184 J/g·°C × 60.0 °C = 62,760 J ≈ 62.8 kJ."],
      ["In a coffee-cup calorimeter the solution’s temperature rises. Is the reaction exothermic or endothermic, and what is the sign of ΔH?",
       "Exothermic. The reaction releases heat into the solution, so q(reaction) = −q(solution) and ΔH is negative."],
      ["What is the difference between a state function and a path function? Give one example of each.",
       "A state function depends only on the initial and final states (enthalpy H, internal energy U). A path function depends on how the change happens (heat q, work w)."],
      ["Use Hess’s law: C(s) + O₂(g) → CO₂(g), ΔH = −393.5 kJ; CO(g) + ½O₂(g) → CO₂(g), ΔH = −283.0 kJ. Find ΔH for C(s) + ½O₂(g) → CO(g).",
       "Keep the first equation and reverse the second: ΔH = −393.5 kJ + 283.0 kJ = −110.5 kJ."],
      ["Define standard enthalpy of formation. What is ΔH°f for O₂(g)?",
       "The enthalpy change when 1 mol of a compound forms from its elements in their standard states. For O₂(g) it is 0 kJ/mol, because an element in its standard state is the reference point."]
    ],
    "w1-c2700": [
      ["Which is the stronger acid: ethanol (pKa ≈ 16) or acetic acid (pKa ≈ 4.76)? By roughly what factor?",
       "Acetic acid, because a lower pKa means a stronger acid. The difference of about 11 pKa units makes it roughly 10¹¹ times more acidic."],
      ["Why is acetic acid so much more acidic than ethanol?",
       "Its conjugate base, acetate, is resonance-stabilized: the negative charge is shared equally by two oxygens. In ethoxide the charge sits on a single oxygen."],
      ["Predict the direction of equilibrium: CH₃COOH + NH₃ ⇌ CH₃COO⁻ + NH₄⁺ (pKa of acetic acid 4.76, of NH₄⁺ 9.25).",
       "To the right. Equilibrium favours forming the weaker acid, and NH₄⁺ (pKa 9.25) is weaker than acetic acid. K ≈ 10^(9.25 − 4.76) ≈ 10^4.5."],
      ["What is the formal charge on nitrogen in the ammonium ion, NH₄⁺?",
       "+1. Formal charge = valence electrons (5) − nonbonding electrons (0) − ½ × bonding electrons (8 ÷ 2 = 4) = +1."],
      ["What are the rules for drawing valid resonance forms?",
       "Only electrons (π bonds and lone pairs) move; atoms stay in place. Each form must be a valid Lewis structure with no second-row atom over an octet, and the total charge stays the same. Forms with fewer formal charges, and negative charge on the more electronegative atom, contribute more."]
    ],
    "w1-c2580": [
      ["What is the pH of a buffer made of 0.20 M acetic acid and 0.10 M sodium acetate? (pKa = 4.76)",
       "pH = pKa + log([A⁻]/[HA]) = 4.76 + log(0.10/0.20) = 4.76 − 0.30 = 4.46."],
      ["At what pH does a buffer work best, and why?",
       "At pH = pKa, where [HA] = [A⁻]. There is equal capacity to neutralize added H⁺ and OH⁻. The useful range is about pKa ± 1."],
      ["Why does water have such a high boiling point for such a small molecule?",
       "Each water molecule can form up to four hydrogen bonds (two as donor, two as acceptor), so a lot of energy is needed to pull molecules apart."],
      ["What ratio [HPO₄²⁻]/[H₂PO₄⁻] gives pH 7.40? (pKa = 6.86)",
       "log(ratio) = 7.40 − 6.86 = 0.54, so the ratio = 10^0.54 ≈ 3.5."],
      ["Describe the hydrophobic effect in one or two sentences.",
       "Nonpolar molecules cluster together in water because that frees the ordered water molecules that surrounded them. The gain in water’s entropy makes the clustering favourable."]
    ],
    "w1-c1500": [
      ["Use dimensional analysis to check whether x = ½at² is consistent.",
       "[a][t²] = (L/T²)(T²) = L, which matches [x] = L. It is consistent; the ½ has no dimensions."],
      ["A vector has magnitude 10.0 m at 30° above the +x axis. Find its components.",
       "Aₓ = 10.0 cos 30° = 8.66 m and A_y = 10.0 sin 30° = 5.00 m."],
      ["Find the magnitude and direction of A = (3.0, −4.0) m.",
       "|A| = √(3.0² + 4.0²) = 5.0 m. Direction: tan⁻¹(−4.0/3.0) = −53.1°, so 53.1° below the +x axis."],
      ["Compute A · B and A × B for A = (1, 2, 0) and B = (3, −1, 0).",
       "A · B = (1)(3) + (2)(−1) + 0 = 1. A × B = (2·0 − 0·(−1), 0·3 − 1·0, 1·(−1) − 2·3) = (0, 0, −7)."],
      ["Find the inverse of f(x) = 2x + 3, and the domain of g(x) = √(x − 1).",
       "f⁻¹(x) = (x − 3)/2. The domain of g is x ≥ 1."]
    ],

    /* ---------------- Week 2 ---------------- */
    "w2-c1050": [
      ["Predict the sign of ΔS: (a) H₂O(l) → H₂O(g); (b) 2 SO₂(g) + O₂(g) → 2 SO₃(g).",
       "(a) Positive: a gas has far more microstates than a liquid. (b) Negative: 3 mol of gas becomes 2 mol of gas."],
      ["Does “spontaneous” mean “fast”? Explain.",
       "No. Spontaneous means thermodynamically favourable without outside help; speed is a question of kinetics. Diamond turning into graphite is spontaneous but extremely slow."],
      ["Write the Boltzmann equation for entropy and say what W means.",
       "S = k ln W, where W is the number of microstates (equivalent arrangements) available to the system and k is Boltzmann’s constant."],
      ["Calculate ΔS° for N₂(g) + 3 H₂(g) → 2 NH₃(g). S° (J/mol·K): N₂ 191.6, H₂ 130.7, NH₃ 192.5.",
       "ΔS° = 2(192.5) − [191.6 + 3(130.7)] = 385.0 − 583.7 = −198.7 J/K."],
      ["Rank by standard molar entropy: H₂O(s), H₂O(l), H₂O(g).",
       "H₂O(s) < H₂O(l) < H₂O(g). More freedom of motion means more microstates."]
    ],
    "w2-c2700": [
      ["Name each functional group: (a) R–CO–R′ (b) R–COO–R′ (c) R–CO–NH₂ (d) R–O–R′.",
       "(a) Ketone (b) ester (c) amide (d) ether."],
      ["Give the IUPAC name of CH₃CH(CH₃)CH₂CH₂CH₃.",
       "2-Methylpentane."],
      ["For rotation about the C2–C3 bond of butane, which conformation is lowest in energy and which is highest?",
       "Lowest: anti, with the two methyl groups 180° apart. Highest: the fully eclipsed form, with the methyls eclipsing each other (0°)."],
      ["Why does methylcyclohexane prefer the methyl group equatorial?",
       "An axial methyl has 1,3-diaxial steric strain with the axial hydrogens on C3 and C5. Equatorial avoids this, so about 95% of molecules have the methyl equatorial at room temperature."],
      ["In cis-1,2-dimethylcyclohexane, how are the methyl groups arranged in each chair?",
       "One axial and one equatorial in both chair forms, so the two chairs have the same energy."]
    ],
    "w2-c2580": [
      ["At pH 7, what is the net charge on (a) glycine, (b) lysine, (c) aspartate?",
       "(a) 0 (a zwitterion). (b) +1, because the side-chain amine is protonated. (c) −1, because the side-chain carboxyl is deprotonated."],
      ["Calculate the isoelectric point of alanine: pKa₁ = 2.34, pKa₂ = 9.69.",
       "pI = (2.34 + 9.69)/2 ≈ 6.02."],
      ["Which amino acid side chains are usually charged at physiological pH?",
       "Asp and Glu (negative); Lys and Arg (positive). His (pKa ≈ 6) is only partly protonated. Cys and Tyr ionize at higher pH."],
      ["Why is the peptide bond planar, and what does that mean for rotation?",
       "Resonance gives the C–N bond partial double-bond character, so the six atoms of the peptide group lie in one plane and cannot rotate about C–N. The backbone can rotate only at the φ and ψ angles."],
      ["Which amino acid is not chiral, and which forms disulfide bonds?",
       "Glycine is not chiral (its side chain is H). Cysteine forms disulfide bonds when two –SH groups are oxidized."]
    ],
    "w2-c1500": [
      ["Evaluate lim(x→3) (x² − 9)/(x − 3).",
       "Factor: (x − 3)(x + 3)/(x − 3) = x + 3, which approaches 6."],
      ["Evaluate lim(x→0) (sin x)/x.",
       "1. This standard limit is proved with the squeeze theorem."],
      ["x(t) = 5t² m. Find the instantaneous velocity at t = 2 s as a limit.",
       "v = lim(Δt→0) [5(2 + Δt)² − 20]/Δt = lim (20Δt + 5Δt²)/Δt = lim (20 + 5Δt) = 20 m/s."],
      ["Is f(x) = (x² − 1)/(x − 1) continuous at x = 1? How could you fix it?",
       "No: f(1) is undefined, a removable discontinuity. Define f(1) = 2, the value of the limit."],
      ["What is the difference between average and instantaneous velocity?",
       "Average velocity is Δx/Δt over an interval (the slope of a secant line). Instantaneous velocity is its limit as Δt → 0 (the slope of the tangent line at one instant)."]
    ],

    /* ---------------- Week 3 ---------------- */
    "w3-c1050": [
      ["A reaction has ΔH° = −92 kJ and ΔS° = −199 J/K. Find ΔG° at 298 K. Is it spontaneous?",
       "ΔG° = ΔH° − TΔS° = −92 kJ − (298 K)(−0.199 kJ/K) = −92 + 59.3 = −32.7 kJ. It is negative, so the reaction is spontaneous at 298 K."],
      ["For the same reaction, above what temperature does it stop being spontaneous?",
       "Set ΔG = 0: T = ΔH/ΔS = (−92 kJ)/(−0.199 kJ/K) ≈ 462 K. Above about 462 K, ΔG is positive."],
      ["State the second law of thermodynamics in terms of the universe.",
       "In any spontaneous process the entropy of the universe increases: ΔS(univ) = ΔS(sys) + ΔS(surr) > 0."],
      ["State the third law of thermodynamics.",
       "The entropy of a perfect crystal at 0 K is zero. That fixed starting point lets us list absolute standard entropies, S°."],
      ["Give the four sign combinations of ΔH and ΔS and what each means for spontaneity.",
       "ΔH −, ΔS +: spontaneous at all temperatures. ΔH +, ΔS −: never spontaneous. ΔH −, ΔS −: spontaneous at low T. ΔH +, ΔS +: spontaneous at high T."]
    ],
    "w3-c2700": [
      ["What makes a molecule chiral, and what is the most common cause?",
       "A chiral molecule cannot be superimposed on its mirror image (it has no mirror plane). The usual cause is a carbon bonded to four different groups."],
      ["The lowest-priority group points away from you, and priorities 1 → 2 → 3 run counterclockwise. R or S?",
       "S. Counterclockwise with the lowest priority at the back is S."],
      ["What is the maximum number of stereoisomers for a molecule with 3 stereocentres?",
       "2³ = 8 (fewer if any are meso compounds)."],
      ["Define a meso compound and give an example.",
       "A compound with stereocentres that is achiral because it has an internal mirror plane, for example (2R,3S)-tartaric acid or cis-1,2-dimethylcyclopentane."],
      ["How do enantiomers and diastereomers differ in physical properties?",
       "Enantiomers share identical physical properties (melting point, solubility) except the direction they rotate plane-polarized light and how they interact with other chiral molecules. Diastereomers have different physical properties."]
    ],
    "w3-c2580": [
      ["Name the four levels of protein structure and what holds each together.",
       "Primary: the amino-acid sequence (peptide bonds). Secondary: α-helices and β-sheets (backbone hydrogen bonds). Tertiary: the overall 3D fold (hydrophobic effect, hydrogen bonds, ionic interactions, disulfides). Quaternary: how several subunits fit together (the same noncovalent forces)."],
      ["In an α-helix, which groups hydrogen bond, and how many residues make one turn?",
       "The C=O of residue n bonds to the N–H of residue n + 4. There are about 3.6 residues per turn, rising 0.54 nm."],
      ["How do parallel and antiparallel β-sheets differ?",
       "In parallel sheets neighbouring strands run in the same N→C direction; in antiparallel sheets they run in opposite directions, which gives straighter, slightly stronger hydrogen bonds."],
      ["Why is proline often found where α-helices end?",
       "Its side chain bonds back to the backbone nitrogen, so it has no N–H to donate a hydrogen bond, and its ring locks the φ angle. Both break the helix."],
      ["What did Anfinsen’s ribonuclease experiment show?",
       "A denatured protein can refold by itself into its active shape once the denaturant is removed, so the amino-acid sequence holds the information for the 3D structure."]
    ],
    "w3-c1500": [
      ["Use the definition of the derivative to find f′(x) for f(x) = x².",
       "f′(x) = lim(h→0) [(x + h)² − x²]/h = lim (2xh + h²)/h = lim (2x + h) = 2x."],
      ["x(t) = 4t³ − 2t + 1 (m). Find v(t), a(t), and the acceleration at t = 2 s.",
       "v(t) = 12t² − 2 m/s, a(t) = 24t m/s², and a(2) = 48 m/s²."],
      ["A ball is dropped from rest from 45 m. How long does it take to reach the ground? (g = 9.8 m/s²)",
       "45 = ½(9.8)t², so t² = 9.18 and t ≈ 3.0 s."],
      ["A ball is thrown straight up at 20 m/s. What maximum height does it reach?",
       "At the top v = 0, so v₀² = 2gh and h = 20²/(2 × 9.8) ≈ 20.4 m."],
      ["Where is f(x) = |x| not differentiable, and why?",
       "At x = 0. The slope is −1 from the left and +1 from the right, so the limit defining the derivative does not exist (a corner)."]
    ],

    /* ---------------- Week 4 ---------------- */
    "w4-c1050": [
      ["Find K at 298 K for a reaction with ΔG° = −10.0 kJ/mol.",
       "K = e^(−ΔG°/RT) = e^(10,000 ÷ (8.314 × 298)) = e^4.04 ≈ 57."],
      ["What is ΔG° at 298 K if K = 1.0 × 10⁻⁵?",
       "ΔG° = −RT ln K = −(8.314)(298)(−11.51) ≈ +28.5 kJ/mol."],
      ["What is the difference between ΔG and ΔG°?",
       "ΔG° applies to standard conditions (1 bar gases, 1 M solutions). ΔG applies to actual conditions: ΔG = ΔG° + RT ln Q. At equilibrium ΔG = 0 and Q = K."],
      ["For N₂ + 3 H₂ ⇌ 2 NH₃ (exothermic), what happens if you (a) add N₂, (b) raise the temperature, (c) reduce the volume?",
       "(a) Shifts right. (b) Shifts left: heat acts like a product, and K decreases. (c) Shifts right, toward fewer moles of gas."],
      ["Q = 0.5 and K = 20. Which way does the reaction go, and what is the sign of ΔG?",
       "Q < K, so it proceeds forward (to the right) and ΔG is negative."]
    ],
    "w4-c2700": [
      ["What does a curved arrow show, and where must it start?",
       "The movement of a pair of electrons. It starts at an electron source (a lone pair or a bond) and points to where the electrons end up (an atom or a new bond)."],
      ["Define nucleophile and electrophile, with one example of each.",
       "A nucleophile is electron-rich and donates an electron pair (OH⁻, NH₃). An electrophile is electron-poor and accepts one (H⁺, a carbocation, the carbon of a C=O)."],
      ["How is a transition state different from an intermediate?",
       "A transition state is an energy maximum with partly made and broken bonds; it cannot be isolated. An intermediate sits in an energy dip between steps and has a real, if short, lifetime (for example a carbocation)."],
      ["In a two-step reaction energy diagram, how do you find the rate-determining step?",
       "It is the step whose transition state is highest in energy, measured from the starting materials."],
      ["Classify each reaction: (a) HBr + ethylene → bromoethane; (b) an alkyl halide heated with strong base gives an alkene.",
       "(a) Addition. (b) Elimination."]
    ],
    "w4-c2580": [
      ["Why is myoglobin’s O₂-binding curve hyperbolic but hemoglobin’s sigmoidal?",
       "Myoglobin has a single O₂ site. Hemoglobin has four sites that bind cooperatively: each O₂ that binds makes the next bind more easily (T state → R state), giving an S-shaped curve."],
      ["What is the Bohr effect?",
       "Lower pH (more H⁺) and more CO₂ lower hemoglobin’s affinity for O₂, so it releases more O₂ in active tissues."],
      ["How does 2,3-bisphosphoglycerate (BPG) affect hemoglobin?",
       "BPG binds in the central cavity of deoxyhemoglobin (T state) and stabilizes it, lowering O₂ affinity and increasing O₂ delivery. This matters at high altitude."],
      ["Myoglobin’s P₅₀ is about 0.3 kPa and hemoglobin’s about 3.5 kPa. Which binds O₂ more tightly?",
       "Myoglobin. A lower P₅₀ means it is half-saturated at a lower O₂ pressure, so its affinity is higher."],
      ["Why can fetal hemoglobin take O₂ from the mother’s blood?",
       "Fetal hemoglobin binds BPG less tightly, so it has a higher O₂ affinity than adult hemoglobin."]
    ],
    "w4-c1500": [
      ["Differentiate y = sin(3x²).",
       "Chain rule: y′ = cos(3x²) · 6x = 6x cos(3x²)."],
      ["Differentiate y = x²eˣ.",
       "Product rule: y′ = 2xeˣ + x²eˣ = xeˣ(x + 2)."],
      ["Differentiate y = ln(x² + 1).",
       "y′ = 2x/(x² + 1)."],
      ["Find dy/dx for x² + y² = 25, and the slope at (3, 4).",
       "2x + 2y·y′ = 0, so y′ = −x/y. At (3, 4) the slope is −3/4."],
      ["Differentiate y = tan x and y = (2x + 1)/(x − 1).",
       "d/dx tan x = sec²x. Quotient rule: [2(x − 1) − (2x + 1)(1)]/(x − 1)² = −3/(x − 1)²."]
    ],

    /* ---------------- Week 5 ---------------- */
    "w5-c1050": [
      ["For 2 N₂O₅ → 4 NO₂ + O₂, relate the rates of change of the three species.",
       "Rate = −½ Δ[N₂O₅]/Δt = ¼ Δ[NO₂]/Δt = Δ[O₂]/Δt."],
      ["If [N₂O₅] falls at 0.020 M/s, how fast does [NO₂] rise?",
       "NO₂ forms twice as fast as N₂O₅ is used up: 0.040 M/s."],
      ["List four factors that affect reaction rate.",
       "Reactant concentration, temperature, surface area (physical state) of the reactants, and a catalyst. The nature of the reactants matters too."],
      ["What is the difference between an average rate and an instantaneous rate?",
       "An average rate is the change in concentration over a time interval. An instantaneous rate is the slope of the tangent to the concentration–time curve at one moment."],
      ["Why does crushing a solid reactant speed up a reaction?",
       "It increases the surface area, so more particles are exposed and can collide with the other reactant."]
    ],
    "w5-c2700": [
      ["Give the rate law and stereochemical outcome of SN2 and SN1 reactions.",
       "SN2: rate = k[RX][Nu⁻], one step, backside attack with inversion of configuration. SN1: rate = k[RX], via a carbocation, giving mostly racemization (often with slight excess inversion)."],
      ["Rank alkyl halides for SN2 reactivity: tertiary, primary, methyl, secondary.",
       "Methyl > primary > secondary > tertiary. Tertiary halides essentially don’t react by SN2 because of steric hindrance."],
      ["Rank carbocation stability and explain the trend.",
       "Tertiary > secondary > primary > methyl. Alkyl groups donate electron density through hyperconjugation and induction, stabilizing the positive charge. Allylic and benzylic cations are also stabilized by resonance."],
      ["Which solvent favours SN2, polar aprotic or polar protic, and why?",
       "Polar aprotic (DMSO, DMF, acetone). It doesn’t hydrogen-bond to the nucleophile, which stays more reactive. Polar protic solvents favour SN1 by stabilizing the carbocation and the leaving group."],
      ["Rank these leaving groups: I⁻, Cl⁻, OH⁻, Br⁻. Why is OH⁻ poor?",
       "I⁻ > Br⁻ > Cl⁻ ≫ OH⁻. Good leaving groups are weak bases, and OH⁻ is a strong base. Protonating an alcohol turns the leaving group into water, which leaves easily."]
    ],
    "w5-c2580": [
      ["What distinguishes an aldose from a ketose? Classify glucose and fructose.",
       "An aldose has an aldehyde at C1; a ketose has a ketone, usually at C2. Glucose is an aldohexose and fructose is a ketohexose."],
      ["What decides whether a sugar is D or L?",
       "The configuration of the stereocentre farthest from the carbonyl. If its –OH points right in the Fischer projection, the sugar is D."],
      ["How do the α and β anomers of D-glucose differ?",
       "At the anomeric carbon, C1. In the Haworth projection, α has the C1 –OH on the opposite side of the ring from C6 (down) and β has it on the same side (up). They interconvert in water (mutarotation)."],
      ["Which glycosidic bonds are found in lactose, sucrose and cellulose?",
       "Lactose: Gal β(1→4) Glc. Sucrose: Glc α(1↔2)β Fru. Cellulose: chains of Glc β(1→4)."],
      ["Why is sucrose a non-reducing sugar while maltose is reducing?",
       "In sucrose both anomeric carbons are locked in the glycosidic bond, so no free aldehyde can form. Maltose keeps one free anomeric carbon that can open to an aldehyde."]
    ],
    "w5-c1500": [
      ["A ball is launched at 20 m/s, 30° above level ground. Find the time of flight, range and maximum height. (g = 9.8 m/s²)",
       "vₓ = 17.3 m/s and v_y = 10.0 m/s. Time = 2v_y/g = 2.04 s. Range = vₓt ≈ 35.3 m. Maximum height = v_y²/2g ≈ 5.1 m."],
      ["At what launch angle is the range greatest on level ground, ignoring air resistance?",
       "45°, because R = v₀² sin 2θ / g and sin 2θ is largest when θ = 45°."],
      ["A car goes around a curve of radius 50 m at 15 m/s. What is its centripetal acceleration?",
       "a = v²/r = 225/50 = 4.5 m/s², pointing toward the centre of the curve."],
      ["A 5 m ladder slides down a wall while its foot moves out at 1 m/s. How fast is the top falling when the foot is 3 m from the wall?",
       "x² + y² = 25, so 2x·x′ + 2y·y′ = 0. With x = 3, y = 4, x′ = 1: y′ = −3/4 m/s. The top falls at 0.75 m/s."],
      ["In projectile motion, which velocity component stays constant, and why?",
       "The horizontal component, because gravity acts only vertically and there is no horizontal force when air resistance is ignored."]
    ],

    /* ---------------- Week 6 ---------------- */
    "w6-c1050": [
      ["Doubling [A] doubles the rate; doubling [B] quadruples it. Write the rate law and overall order.",
       "Rate = k[A][B]². First order in A, second order in B, third order overall."],
      ["What are the units of k for a second-order reaction when rate is in M/s?",
       "M⁻¹ s⁻¹ (L mol⁻¹ s⁻¹)."],
      ["Rate = k[NO]²[O₂]. The rate is 0.028 M/s when [NO] = 0.020 M and [O₂] = 0.010 M. Find k.",
       "k = 0.028 ÷ (0.020² × 0.010) = 0.028 ÷ (4.0 × 10⁻⁶) = 7.0 × 10³ M⁻² s⁻¹."],
      ["Can you read the rate law off the balanced equation? Why or why not?",
       "No, unless the reaction is a single elementary step. Orders must be found by experiment, because the overall equation does not show the mechanism."],
      ["For a zero-order reaction, what happens to the rate when you triple the concentration?",
       "Nothing. The rate stays the same (rate = k)."]
    ],
    "w6-c2700": [
      ["What is Zaitsev’s rule?",
       "In an elimination, the major product is usually the more substituted, more stable alkene."],
      ["What geometry does an E2 reaction need?",
       "Anti-periplanar: the H and the leaving group lie in one plane, 180° apart. In a cyclohexane both must be axial (trans-diaxial)."],
      ["Predict the main mechanism for 2-bromo-2-methylpropane with (a) NaOCH₃ in methanol, (b) methanol alone, warmed.",
       "(a) E2: a strong base with a tertiary substrate. (b) SN1 and E1 together: a weak nucleophile and a stable tertiary carbocation; heat increases the E1 share."],
      ["Predict the main mechanism for 1-bromobutane with (a) NaCN in DMSO, (b) potassium tert-butoxide.",
       "(a) SN2: a good nucleophile, primary substrate, polar aprotic solvent. (b) E2: a bulky strong base favours elimination, giving 1-butene."],
      ["How does the deuterium isotope effect support the E2 mechanism?",
       "C–D bonds break more slowly than C–H bonds. Deuterated substrates react several times more slowly in E2, showing that the C–H bond breaks in the rate-determining step."]
    ],
    "w6-c2580": [
      ["Write the Michaelis–Menten equation and define Km.",
       "v₀ = Vmax[S]/(Km + [S]). Km is the substrate concentration at which v₀ = ½Vmax."],
      ["An enzyme has Km = 2 mM and Vmax = 100 µmol/min. What is v₀ at [S] = 6 mM?",
       "v₀ = 100 × 6/(2 + 6) = 75 µmol/min."],
      ["On a Lineweaver–Burk plot, what do the intercepts and slope give you?",
       "The y-intercept is 1/Vmax, the x-intercept is −1/Km, and the slope is Km/Vmax."],
      ["How do competitive and pure non-competitive inhibitors change Km and Vmax?",
       "Competitive: apparent Km rises and Vmax is unchanged (lines meet on the y-axis). Pure non-competitive: Vmax falls and Km is unchanged (lines meet on the x-axis)."],
      ["What does kcat/Km measure?",
       "Catalytic efficiency, also called the specificity constant. Its upper limit, about 10⁸–10⁹ M⁻¹ s⁻¹, is set by how fast molecules diffuse together."]
    ],
    "w6-c1500": [
      ["A 1200 kg car speeds up from 0 to 25 m/s in 10 s. What net force acts on it?",
       "a = 2.5 m/s², so F = ma = 1200 × 2.5 = 3000 N."],
      ["A 70 kg person stands on a scale in an elevator accelerating upward at 2.0 m/s². What does the scale read? (g = 9.8 m/s²)",
       "N − mg = ma, so N = 70(9.8 + 2.0) = 826 N."],
      ["State Newton’s third law. What force pairs with a book’s weight as it rests on a table?",
       "Forces come in equal and opposite pairs acting on different objects. The book’s weight (Earth pulls the book down) pairs with the book pulling Earth up. The table’s normal force is not its third-law pair."],
      ["Two blocks, 2 kg and 3 kg, touch on a frictionless floor. A 10 N push acts on the 2 kg block. Find the acceleration and the contact force between them.",
       "a = 10 N / 5 kg = 2 m/s². The contact force on the 3 kg block is 3 × 2 = 6 N."],
      ["Use derivatives to find the maximum of f(x) = −x² + 4x + 1.",
       "f′(x) = −2x + 4 = 0 gives x = 2. f″ = −2 < 0, so it is a maximum: f(2) = 5."]
    ],

    /* ---------------- Week 7 ---------------- */
    "w7-c1050": [
      ["A first-order reaction has k = 0.0693 min⁻¹. What is its half-life?",
       "t½ = 0.693/k = 10.0 min."],
      ["Starting from 0.80 M, how much of that first-order reactant is left after 30 min?",
       "30 min is three half-lives: 0.80 → 0.40 → 0.20 → 0.10 M."],
      ["Which plot is a straight line for zero-, first- and second-order reactions?",
       "Zero order: [A] vs t (slope −k). First order: ln[A] vs t (slope −k). Second order: 1/[A] vs t (slope +k)."],
      ["For a second-order reaction, how does the half-life depend on the starting concentration?",
       "t½ = 1/(k[A]₀), so each half-life is longer than the last (twice as long) as the concentration falls."],
      ["Carbon-14 has a half-life of 5730 years. What fraction remains after 11,460 years?",
       "That is two half-lives, so ¼ (25%) remains."]
    ],
    "w7-c2700": [
      ["Predict the major product of HBr + propene and explain.",
       "2-Bromopropane. Protonation forms the more stable secondary carbocation (Markovnikov’s rule), and Br⁻ adds to that carbon."],
      ["Calculate the degree of unsaturation of C₆H₁₀.",
       "(2C + 2 − H)/2 = (14 − 10)/2 = 2, so two rings and/or π bonds."],
      ["In 1-chloropropene, CH₃ and Cl are on the same side of the double bond. Is it E or Z?",
       "Z. On each carbon the higher-priority group (CH₃ over H; Cl over H) is on the same side."],
      ["What does the Hammond postulate say, and how does it apply to carbocation formation?",
       "A transition state looks most like the species nearest to it in energy. Carbocation formation is endergonic, so its transition state resembles the carbocation, and more stable carbocations form faster."],
      ["HCl adds to 3-methyl-1-butene. What products form, and why is one unexpected?",
       "About equal amounts of 2-chloro-3-methylbutane and 2-chloro-2-methylbutane. The second comes from a hydride shift that turns the secondary carbocation into a more stable tertiary one before Cl⁻ adds."]
    ],
    "w7-c2580": [
      ["Name chymotrypsin’s catalytic triad and the role of each residue.",
       "Ser195 is the nucleophile that attacks the carbonyl. His57 acts as a general base and acid, moving protons. Asp102 holds His57 in position and stabilizes its positive charge."],
      ["What is the oxyanion hole?",
       "A pocket where backbone N–H groups hydrogen bond to the negatively charged oxygen of the tetrahedral intermediate, stabilizing the transition state."],
      ["Name four general strategies enzymes use to speed up reactions.",
       "Acid–base catalysis, covalent catalysis, metal-ion catalysis, and binding effects (bringing substrates close and correctly oriented, and stabilizing the transition state)."],
      ["How is allosteric regulation different from competitive inhibition?",
       "Allosteric effectors bind a site other than the active site and change the enzyme’s shape and activity, often giving sigmoidal kinetics. Competitive inhibitors bind the active site itself."],
      ["What is a zymogen? Give an example.",
       "An inactive enzyme precursor that is switched on by cutting the chain, for example chymotrypsinogen → chymotrypsin or trypsinogen → trypsin."]
    ],
    "w7-c1500": [
      ["A 10 kg box slides down a 30° incline with μk = 0.20. Find its acceleration. (g = 9.8 m/s²)",
       "a = g(sin 30° − μk cos 30°) = 9.8(0.500 − 0.173) ≈ 3.2 m/s² down the slope. The mass cancels."],
      ["What minimum coefficient of static friction keeps a block at rest on a 25° incline?",
       "μs = tan 25° ≈ 0.47."],
      ["A 1000 kg car rounds a flat curve of radius 40 m at 12 m/s. How much friction force is needed?",
       "F = mv²/r = 1000 × 144/40 = 3600 N, directed toward the centre."],
      ["Find the general antiderivative of f(x) = 3x² − 4 + cos x.",
       "F(x) = x³ − 4x + sin x + C."],
      ["a(t) = 6t m/s², v(0) = 2 m/s and x(0) = 0. Find v(t) and x(t).",
       "v(t) = 3t² + 2 m/s and x(t) = t³ + 2t m."]
    ],

    /* ---------------- Week 8 ---------------- */
    "w8-c1050": [
      ["k = 1.0 × 10⁻³ s⁻¹ at 300 K and 4.0 × 10⁻³ s⁻¹ at 320 K. Find the activation energy.",
       "ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂). ln 4 = 1.386 and 1/300 − 1/320 = 2.083 × 10⁻⁴ K⁻¹. Ea = (1.386 × 8.314)/(2.083 × 10⁻⁴) ≈ 5.5 × 10⁴ J/mol = 55 kJ/mol."],
      ["What two conditions must a collision meet to lead to reaction?",
       "Enough energy (at least the activation energy) and the right orientation."],
      ["Mechanism: NO₂ + NO₂ → NO₃ + NO (slow); NO₃ + CO → NO₂ + CO₂ (fast). Give the overall reaction, the intermediate, and the rate law.",
       "Overall: NO₂ + CO → NO + CO₂. Intermediate: NO₃. Rate = k[NO₂]², from the slow step."],
      ["How does a catalyst speed up a reaction? Does it change ΔH or K?",
       "It provides a different pathway with a lower activation energy. It does not change ΔH, ΔG or K; it speeds up the forward and reverse reactions equally."],
      ["What is the molecularity and rate law of the elementary step A + B → C?",
       "Bimolecular, with rate = k[A][B]."]
    ],
    "w8-c2700": [
      ["What is the product and regiochemistry of hydroboration–oxidation of 1-methylcyclohexene?",
       "trans-2-Methylcyclohexanol. The OH ends up on the less substituted carbon (anti-Markovnikov), and H and OH add to the same face (syn)."],
      ["Compare oxymercuration–demercuration with hydroboration–oxidation.",
       "Both add H₂O without carbocation rearrangements. Oxymercuration gives the Markovnikov alcohol; hydroboration gives the anti-Markovnikov alcohol with syn addition."],
      ["What is the stereochemistry of Br₂ adding to cyclopentene, and why?",
       "trans-1,2-Dibromocyclopentane (anti addition), because Br⁻ attacks the cyclic bromonium ion from the opposite face."],
      ["What does ozonolysis (O₃, then Zn/H₃O⁺) do to 2-methyl-2-butene?",
       "It cleaves the C=C bond, giving acetone and acetaldehyde."],
      ["What does OsO₄ do to an alkene, and with what stereochemistry?",
       "It forms a 1,2-diol by syn addition. For example, cyclohexene gives cis-1,2-cyclohexanediol."]
    ],
    "w8-c2580": [
      ["What are the three parts of a nucleotide?",
       "A nitrogenous base, a five-carbon sugar (ribose or 2′-deoxyribose), and one or more phosphate groups on the 5′ carbon."],
      ["Which bases are purines and which are pyrimidines?",
       "Purines: adenine and guanine. Pyrimidines: cytosine, thymine (DNA) and uracil (RNA)."],
      ["A DNA sample is 20% adenine. What are the percentages of T, G and C?",
       "By Chargaff’s rules T = 20%, so G + C = 60%: G = 30% and C = 30%."],
      ["Write the strand complementary to 5′-ATGCCA-3′, in the 5′→3′ direction.",
       "5′-TGGCAT-3′."],
      ["Why does DNA rich in G–C pairs melt at a higher temperature?",
       "G–C pairs form three hydrogen bonds (A–T pairs form two) and stack more strongly, so more energy is needed to separate the strands."]
    ],
    "w8-c1500": [
      ["Evaluate ∫₀² (3x² + 1) dx.",
       "[x³ + x] from 0 to 2 = 8 + 2 = 10."],
      ["Find ∫ 2x(x² + 1)⁵ dx.",
       "Let u = x² + 1, du = 2x dx: ∫u⁵ du = (x² + 1)⁶/6 + C."],
      ["Find d/dx ∫₀ˣ cos(t²) dt.",
       "cos(x²), by part 1 of the Fundamental Theorem of Calculus."],
      ["Estimate ∫₀⁴ x² dx with a left Riemann sum of 4 rectangles, and compare with the exact value.",
       "Width 1, heights f(0) + f(1) + f(2) + f(3) = 0 + 1 + 4 + 9 = 14. The exact value is 64/3 ≈ 21.3; the left sum underestimates because x² is increasing."],
      ["v(t) = 3t² m/s. How far does the object move between t = 1 s and t = 3 s?",
       "∫₁³ 3t² dt = [t³] from 1 to 3 = 27 − 1 = 26 m (net change theorem)."]
    ],

    /* ---------------- Week 9 ---------------- */
    "w9-c1050": [
      ["Find the oxidation number of Mn in MnO₄⁻ and of Cr in Cr₂O₇²⁻.",
       "Mn is +7 (x − 8 = −1). Cr is +6 (2x − 14 = −2)."],
      ["In Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), what is oxidized, and what is the oxidizing agent?",
       "Zn is oxidized (it loses electrons). Cu²⁺ is the oxidizing agent (it is reduced)."],
      ["Balance in acidic solution: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺.",
       "MnO₄⁻ + 8 H⁺ + 5 Fe²⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O. Charge check: +17 on both sides."],
      ["Write cell notation for a zinc–copper galvanic cell and name the anode and cathode.",
       "Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s). Zinc is the anode (oxidation) and copper is the cathode (reduction)."],
      ["What does the salt bridge do?",
       "It lets ions move between the half-cells, keeping each solution electrically neutral and completing the circuit."]
    ],
    "w9-c2700": [
      ["Write the propagation steps for the chlorination of methane.",
       "Cl· + CH₄ → HCl + ·CH₃, then ·CH₃ + Cl₂ → CH₃Cl + Cl·."],
      ["Why is radical bromination much more selective than chlorination?",
       "H-atom abstraction by Br· is endothermic, so its transition state comes late and looks like the radical (Hammond postulate). Differences in radical stability (3° > 2° > 1°) then matter much more."],
      ["Predict the major product of 2-methylpropane with Br₂ and light.",
       "2-Bromo-2-methylpropane, from substitution at the tertiary C–H."],
      ["What does NBS do to cyclohexene, and why at that position?",
       "Allylic bromination, giving 3-bromocyclohexene. The allylic radical intermediate is stabilized by resonance."],
      ["Name the three stages of a radical chain reaction.",
       "Initiation (radicals form, e.g. light splits Cl₂), propagation (a radical reacts to form product and a new radical), and termination (two radicals combine)."]
    ],
    "w9-c2580": [
      ["Why do unsaturated fatty acids make membranes more fluid?",
       "Cis double bonds put kinks in the chains, so they pack less tightly and have weaker van der Waals attractions."],
      ["What does cholesterol do to membrane fluidity?",
       "It buffers it: cholesterol reduces fluidity at high temperature and stops the lipids packing into a rigid gel at low temperature."],
      ["Compare simple diffusion, facilitated diffusion and active transport.",
       "Simple diffusion: down the gradient straight through the bilayer, no protein or energy. Facilitated diffusion: down the gradient through a channel or carrier, no energy, and it saturates. Active transport: against the gradient through a pump, using energy (ATP or another gradient)."],
      ["What does the Na⁺/K⁺-ATPase move for each ATP it hydrolyzes?",
       "3 Na⁺ out of the cell and 2 K⁺ in, maintaining the gradients across the plasma membrane. Because it moves unequal charge, it is electrogenic."],
      ["Describe a phospholipid and explain why phospholipids form bilayers.",
       "Glycerol carrying two fatty-acid tails (hydrophobic) and a phosphate-containing head group (hydrophilic). Their roughly cylindrical, amphipathic shape makes the tails face each other away from water, forming a bilayer."]
    ],
    "w9-c1500": [
      ["How much work does it take to stretch a spring (k = 200 N/m) from 0 to 0.10 m?",
       "W = ∫₀^0.10 kx dx = ½kx² = ½(200)(0.10)² = 1.0 J."],
      ["A 2.0 kg block slides from rest down a frictionless ramp 5.0 m high. How fast is it moving at the bottom?",
       "mgh = ½mv², so v = √(2gh) = √98 ≈ 9.9 m/s. The mass cancels."],
      ["A 1500 kg car speeds up from 10 m/s to 20 m/s. How much net work was done on it?",
       "W = ΔKE = ½(1500)(20² − 10²) = 225,000 J = 225 kJ."],
      ["What makes a force conservative? Name one conservative and one non-conservative force.",
       "Its work doesn’t depend on the path (zero around a closed loop), so a potential energy can be defined. Gravity and spring forces are conservative; kinetic friction is not."],
      ["A 60 kg student climbs 3.0 m of stairs in 4.0 s. What is their average power output?",
       "P = mgh/t = (60 × 9.8 × 3.0)/4.0 = 441 W."]
    ],

    /* ---------------- Week 10 ---------------- */
    "w10-c1050": [
      ["Find E°cell for Zn | Zn²⁺ ‖ Cu²⁺ | Cu. E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V.",
       "E°cell = E°(cathode) − E°(anode) = 0.34 − (−0.76) = +1.10 V."],
      ["Calculate ΔG° for that cell. (n = 2, F = 96,485 C/mol)",
       "ΔG° = −nFE° = −2 × 96,485 × 1.10 ≈ −2.12 × 10⁵ J = −212 kJ."],
      ["Find K at 298 K for a reaction with n = 2 and E° = +0.30 V.",
       "log K = nE°/0.0592 = (2 × 0.30)/0.0592 = 10.1, so K ≈ 1.4 × 10¹⁰."],
      ["Use the Nernst equation for the Zn–Cu cell with [Zn²⁺] = 1.0 M and [Cu²⁺] = 0.010 M at 298 K.",
       "E = E° − (0.0592/n) log Q = 1.10 − (0.0296) log(1.0/0.010) = 1.10 − 0.059 = 1.04 V."],
      ["If E°cell is positive, what is the sign of ΔG°, and is K bigger or smaller than 1?",
       "ΔG° is negative and K > 1, so products are favoured."]
    ],
    "w10-c2700": [
      ["State Hückel’s rule. Is cyclooctatetraene aromatic?",
       "A planar, cyclic, fully conjugated ring with 4n + 2 π electrons is aromatic. Cyclooctatetraene has 8 π electrons (a 4n number) and is tub-shaped, so it is not aromatic."],
      ["Is the cyclopentadienyl anion aromatic? What about the cation?",
       "The anion has 6 π electrons and is aromatic. The cation has 4 π electrons and is antiaromatic, which makes it very unstable."],
      ["Classify –OH, –NO₂, –Cl and –CH₃ as activating or deactivating, and as ortho/para or meta directors.",
       "–OH: activating, ortho/para. –NO₂: deactivating, meta. –Cl: deactivating, ortho/para. –CH₃: activating, ortho/para."],
      ["Give the electrophile and reagents for nitration and for Friedel–Crafts acylation.",
       "Nitration: NO₂⁺, made from HNO₃ and H₂SO₄. Acylation: the acylium ion RC≡O⁺, made from RCOCl and AlCl₃."],
      ["Why does electrophilic aromatic substitution finish by losing H⁺ instead of adding a nucleophile?",
       "Losing H⁺ from the carbocation intermediate restores the aromatic ring, which is far more stable than an addition product would be."]
    ],
    "w10-c2580": [
      ["Glucose → glucose 6-phosphate has ΔG°′ = +13.8 kJ/mol, and ATP hydrolysis has ΔG°′ = −30.5 kJ/mol. What is ΔG°′ for the coupled hexokinase reaction?",
       "+13.8 − 30.5 = −16.7 kJ/mol, so the coupled reaction is favourable."],
      ["What are the net products of glycolysis for one glucose?",
       "2 pyruvate, 2 ATP (4 made minus 2 used) and 2 NADH, plus 2 H⁺ and 2 H₂O."],
      ["Name the three irreversible, regulated steps of glycolysis.",
       "Hexokinase, phosphofructokinase-1 (PFK-1, the main control point) and pyruvate kinase."],
      ["Why must cells regenerate NAD⁺, and how do they do it without oxygen?",
       "Glyceraldehyde 3-phosphate dehydrogenase needs NAD⁺, so glycolysis stops without it. Without O₂, lactate dehydrogenase (muscle) or alcoholic fermentation (yeast) uses NADH to reduce pyruvate or acetaldehyde, regenerating NAD⁺."],
      ["Which glycolysis steps make ATP by substrate-level phosphorylation?",
       "Phosphoglycerate kinase (1,3-bisphosphoglycerate → 3-phosphoglycerate) and pyruvate kinase (phosphoenolpyruvate → pyruvate)."]
    ],
    "w10-c1500": [
      ["A 2.0 kg cart moving at 3.0 m/s hits and sticks to a 1.0 kg cart at rest. What is the final speed, and how much kinetic energy is lost?",
       "v = (2.0 × 3.0)/3.0 = 2.0 m/s. KE goes from 9.0 J to 6.0 J, so 3.0 J is lost."],
      ["A 0.15 kg ball moving at 40 m/s is caught and stopped in 0.010 s. What is the average force?",
       "Impulse = Δp = 0.15 × 40 = 6.0 kg·m/s, so F = 6.0/0.010 = 600 N."],
      ["A ball hits an identical ball at rest head-on in a 1D elastic collision. What happens?",
       "They swap velocities: the first ball stops and the second moves off with the first ball’s original velocity."],
      ["Find the centre of mass of a 2 kg mass at x = 0 and a 3 kg mass at x = 5 m.",
       "x_cm = (2 × 0 + 3 × 5)/(2 + 3) = 3 m."],
      ["Evaluate ∫₁ᵉ (1/x) dx, and find the area between y = x and y = x² from x = 0 to 1.",
       "∫₁ᵉ (1/x) dx = ln e − ln 1 = 1. Area = ∫₀¹ (x − x²) dx = ½ − ⅓ = 1/6."]
    ],

    /* ---------------- Week 11 ---------------- */
    "w11-c1050": [
      ["How many grams of copper plate out when 2.00 A flows for 30.0 min through a Cu²⁺ solution? (M = 63.55 g/mol)",
       "Q = 2.00 A × 1800 s = 3600 C. Moles of e⁻ = 3600/96,485 = 0.0373, so moles of Cu = 0.0187. Mass = 0.0187 × 63.55 ≈ 1.19 g."],
      ["How do primary and secondary batteries differ? Give an example of each.",
       "Primary cells can’t be recharged (an alkaline battery). Secondary cells can be recharged by running the reaction in reverse (lead–acid, lithium-ion)."],
      ["How does a sacrificial zinc anode protect a steel ship’s hull?",
       "Zinc is oxidized more easily than iron (its E° is more negative), so the zinc corrodes instead and the iron acts as the cathode."],
      ["Is the anode positive or negative in an electrolytic cell? How does that compare with a galvanic cell?",
       "In an electrolytic cell the anode is positive (connected to the + terminal); in a galvanic cell it is negative. In both, oxidation happens at the anode."],
      ["What does iron need in order to rust?",
       "Oxygen and water; dissolved salts speed it up. Iron is oxidized to Fe²⁺ at anodic areas while O₂ is reduced at cathodic areas, and Fe²⁺ is oxidized further to rust, Fe₂O₃·xH₂O."]
    ],
    "w11-c2700": [
      ["Why are aldehydes usually more reactive than ketones toward nucleophiles?",
       "An aldehyde has less steric hindrance (H in place of an R group), and its carbonyl carbon is more electrophilic because it has one fewer electron-donating alkyl group."],
      ["What does NaBH₄ do to butanal and to 2-butanone?",
       "It reduces them to alcohols: 1-butanol (primary) and 2-butanol (secondary)."],
      ["What forms when cyclohexanone reacts with CH₃MgBr and then H₃O⁺?",
       "1-Methylcyclohexanol, a tertiary alcohol."],
      ["Contrast imine and enamine formation.",
       "Primary amines (RNH₂) give imines (C=N–R). Secondary amines (R₂NH) give enamines (C=C–NR₂), because no N–H is left to lose. Both are acid-catalyzed, lose water, and work best near pH 4–5."],
      ["What is the difference between a hemiacetal and an acetal, and why are acetals useful?",
       "A hemiacetal has an –OH and an –OR on the same carbon; an acetal has two –OR groups. Acetals are stable to bases and nucleophiles, so they protect carbonyl groups, and aqueous acid removes them."]
    ],
    "w11-c2580": [
      ["What does one turn of the citric acid cycle produce from one acetyl-CoA?",
       "2 CO₂, 3 NADH, 1 FADH₂ and 1 GTP (or ATP)."],
      ["What does the pyruvate dehydrogenase complex do, and which cofactors does it use?",
       "Pyruvate + CoA + NAD⁺ → acetyl-CoA + CO₂ + NADH. Its cofactors are TPP, lipoate, CoA, FAD and NAD⁺."],
      ["Which steps of the citric acid cycle release CO₂?",
       "Isocitrate dehydrogenase (isocitrate → α-ketoglutarate) and α-ketoglutarate dehydrogenase (α-ketoglutarate → succinyl-CoA)."],
      ["Which citric acid cycle enzyme is also part of the electron transport chain?",
       "Succinate dehydrogenase, which is Complex II in the inner mitochondrial membrane."],
      ["Give two ways the citric acid cycle is regulated.",
       "High NADH/NAD⁺ and ATP inhibit citrate synthase, isocitrate dehydrogenase and α-ketoglutarate dehydrogenase, while ADP and Ca²⁺ activate isocitrate dehydrogenase. Products such as succinyl-CoA and citrate also inhibit earlier steps."]
    ],
    "w11-c1500": [
      ["A wheel starts from rest with angular acceleration 2.0 rad/s² for 5.0 s. Find its final angular speed and the angle it turns.",
       "ω = αt = 10 rad/s and θ = ½αt² = 25 rad."],
      ["Find the moment of inertia of a solid disk (2.0 kg, radius 0.30 m) about its central axis.",
       "I = ½MR² = ½(2.0)(0.30)² = 0.090 kg·m²."],
      ["A 40 N force pushes perpendicular to a 0.25 m wrench. What torque results, and what angular acceleration if I = 0.50 kg·m²?",
       "τ = rF = 0.25 × 40 = 10 N·m, and α = τ/I = 20 rad/s²."],
      ["A skater spins at 2.0 rev/s with I = 4.0 kg·m², then pulls their arms in to I = 1.6 kg·m². What is her new spin rate?",
       "Angular momentum is conserved: ω = (4.0 × 2.0)/1.6 = 5.0 rev/s."],
      ["A solid ball and a hoop roll without slipping from rest down the same ramp. Which reaches the bottom first, and why?",
       "The solid ball. Its moment of inertia is smaller relative to MR² (2/5 versus 1), so less of its energy goes into spinning and more into moving forward."]
    ],

    /* ---------------- Week 12 ---------------- */
    "w12-c1050": [
      ["Write the equation linking ΔG°, K and E°cell.",
       "ΔG° = −RT ln K = −nFE°cell."],
      ["A reaction has K = 1.0 × 10⁻³ at 298 K. Is it product- or reactant-favoured, and what are the signs of ΔG° and E°?",
       "Reactant-favoured (K < 1). ΔG° is positive and E° is negative."],
      ["Can a reaction with a very negative ΔG° still be slow? What controls its speed?",
       "Yes. ΔG° describes the equilibrium, not the rate. Speed depends on the activation energy, which a catalyst can lower."],
      ["Raising the temperature increases k for almost every reaction. Does it always increase K?",
       "No. k rises with T (Arrhenius), but K rises with T only for endothermic reactions; for exothermic reactions K falls (Le Châtelier)."],
      ["Match each quantity to its unit: ΔG°, E°, a first-order k, K.",
       "ΔG°: J/mol (or kJ/mol). E°: volts. First-order k: s⁻¹. K: no units."]
    ],
    "w12-c2700": [
      ["Rank by reactivity toward nucleophilic acyl substitution: amide, acid chloride, ester, anhydride.",
       "Acid chloride > anhydride > ester > amide. Better leaving groups, and less resonance donation into the C=O, make a derivative more reactive."],
      ["Outline base-promoted ester hydrolysis (saponification). Why can’t it reverse?",
       "OH⁻ adds to the C=O to form a tetrahedral intermediate, the alkoxide leaves, and the carboxylic acid is immediately deprotonated to a carboxylate. A carboxylate isn’t electrophilic, so the reaction can’t run backward."],
      ["What forms when acetyl chloride reacts with (a) ethanol, (b) excess ammonia?",
       "(a) Ethyl acetate (an ester) and HCl. (b) Acetamide and NH₄Cl."],
      ["Why are amides so unreactive?",
       "The nitrogen lone pair is delocalized into the carbonyl by resonance, making the carbon less electrophilic, and ⁻NH₂ is a very poor leaving group."],
      ["What is the pH of a solution in which [RCOO⁻] = [RCOOH], for an acid with pKa 4.2?",
       "pH = pKa = 4.2, from Henderson–Hasselbalch with a ratio of 1."]
    ],
    "w12-c2580": [
      ["Trace the path of electrons from NADH to O₂.",
       "NADH → Complex I → ubiquinone (Q) → Complex III → cytochrome c → Complex IV → O₂, forming H₂O. Electrons from succinate (FADH₂) enter through Complex II to Q."],
      ["What is the chemiosmotic theory?",
       "Electron transport pumps protons out of the matrix, building a proton-motive force. Protons flow back through ATP synthase, which uses that energy to make ATP."],
      ["Calculate ΔG°′ for electron transfer from NADH to O₂. E°′(NAD⁺/NADH) = −0.320 V; E°′(½O₂/H₂O) = +0.816 V.",
       "ΔE°′ = 0.816 − (−0.320) = 1.136 V. ΔG°′ = −nFΔE°′ = −2 × 96,485 × 1.136 ≈ −219 kJ/mol."],
      ["About how many ATP come from completely oxidizing one glucose?",
       "About 30–32 ATP, using about 2.5 ATP per NADH and 1.5 per FADH₂. The exact number depends on how cytosolic NADH gets into the mitochondria."],
      ["How many rounds of β-oxidation does palmitate (16:0) go through, and what do they produce?",
       "7 rounds, giving 8 acetyl-CoA, 7 FADH₂ and 7 NADH. After the citric acid cycle and oxidative phosphorylation that is about 106 ATP, once 2 ATP-equivalents for activation are subtracted."]
    ],
    "w12-c1500": [
      ["State Einstein’s two postulates of special relativity.",
       "(1) The laws of physics are the same in every inertial frame. (2) The speed of light in a vacuum, c, is the same for all inertial observers, regardless of the motion of the source."],
      ["A spaceship moves at 0.80c. How long does 1.0 h on the ship’s clock last for an observer on Earth?",
       "γ = 1/√(1 − 0.80²) = 1/0.60 ≈ 1.67, so Δt = γΔt₀ ≈ 1.67 h."],
      ["A rod is 2.0 m long at rest. How long is it measured to be when moving at 0.60c along its length?",
       "γ = 1/√(1 − 0.36) = 1.25, so L = L₀/γ = 1.6 m."],
      ["What is the rest energy of 1.0 g of matter?",
       "E = mc² = (0.0010 kg)(3.0 × 10⁸ m/s)² = 9.0 × 10¹³ J."],
      ["For n = 2, what values can l and mₗ take, and how many electrons fit in that shell?",
       "l = 0 (mₗ = 0) or l = 1 (mₗ = −1, 0, +1), giving 4 orbitals. With two spin states each, the n = 2 shell holds 8 electrons (2n²)."]
    ]
  };
})(typeof self !== "undefined" ? self : this);
