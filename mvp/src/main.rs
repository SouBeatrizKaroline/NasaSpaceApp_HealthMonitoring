#![forbid(unsafe_code)]
//! AstroCare-Q | Spaceflight-Grade Clinical Triage & QUBO Optimizer (Rust)
//!
//! Compliance & Safety:
//! - `#![forbid(unsafe_code)]` enforces strict compile-time memory safety.
//! - Zero external crates: full SBOM transparency, zero PRC/foreign supply-chain links,
//!   deterministic latency, and offline WASM/embedded portability.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum GravityEnvironment {
    Microgravity0G,
    Lunar016G,
    Mars038G,
    Earth1G,
}

impl GravityEnvironment {
    fn label(&self) -> &'static str {
        match self {
            GravityEnvironment::Microgravity0G => "Microgravity (0g - Transit / Station)",
            GravityEnvironment::Lunar016G => "Lunar Gravity (0.16g - Artemis Base)",
            GravityEnvironment::Mars038G => "Martian Gravity (0.38g - Surface / Rover)",
            GravityEnvironment::Earth1G => "Earth Gravity (1.0g - Post-Return)",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Severity {
    Nominal,
    Attention,
    Critical,
}

impl Severity {
    fn label(&self) -> &'static str {
        match self {
            Severity::Nominal => "GREEN (Nominal)",
            Severity::Attention => "AMBER (Self-Care NANDA-I)",
            Severity::Critical => "RED (Immediate Action + Flight Surgeon Alert)",
        }
    }
}

#[derive(Debug, Clone)]
struct ClinicalProtocol {
    id: &'static str,
    name: &'static str,
    nanda_code: &'static str,
    disciplines: &'static str,
    nasa_hazard: &'static str,
    clinical_benefit: f64, // Risk reduction impact (0.0 - 10.0)
    time_minutes: u32,     // Required astronaut time
    supply_units: u32,     // Medical kit units consumed
    severity: Severity,
}

struct AnamnesisInput {
    environment: GravityEnvironment,
    blurred_vision: bool,
    sleep_hours: f32,
    high_radiation_dosimeter: bool,
    elevated_rppg_hr: bool,
    orthostatic_dizziness: bool,
}

/// Evaluates Space Anamnesis + Multimodal inputs + Gravity Environment
/// into multidisciplinary NANDA-I & Medical triage candidates.
fn evaluate_anamnesis(input: &AnamnesisInput) -> Vec<ClinicalProtocol> {
    let mut protocols = Vec::new();

    if input.blurred_vision {
        // Cephalad fluid shift in 0g elevates SANS risk priority
        let sans_weight = if input.environment == GravityEnvironment::Microgravity0G {
            9.5
        } else {
            8.2
        };
        protocols.push(ClinicalProtocol {
            id: "P1",
            name: "SANS Amsler Grid Screening + Low-Sodium Protocol",
            nanda_code: "NANDA 00204",
            disciplines: "Nursing + Nutrition + Medicine",
            nasa_hazard: "Altered Gravity Fields",
            clinical_benefit: sans_weight,
            time_minutes: 8,
            supply_units: 0,
            severity: Severity::Critical,
        });
    }

    if input.sleep_hours < 5.5 {
        protocols.push(ClinicalProtocol {
            id: "P2",
            name: "Warm Cabin Lighting + 4-7-8 Breathing & Rest Pacing",
            nanda_code: "NANDA 00198",
            disciplines: "Nursing + Psychology",
            nasa_hazard: "Isolation & Confinement",
            clinical_benefit: 6.8,
            time_minutes: 15,
            supply_units: 0,
            severity: Severity::Attention,
        });
    }

    if input.high_radiation_dosimeter {
        protocols.push(ClinicalProtocol {
            id: "P3",
            name: "Shielded Module Relocation + Skin Barrier & Med-Kit Potency Check",
            nanda_code: "NANDA 00046",
            disciplines: "Nursing + Pharmacy + Medicine",
            nasa_hazard: "Space Radiation",
            clinical_benefit: 8.9,
            time_minutes: 12,
            supply_units: 2,
            severity: Severity::Critical,
        });
    }

    if input.elevated_rppg_hr {
        protocols.push(ClinicalProtocol {
            id: "P4",
            name: "Fractionated Electrolyte Rehydration + Repeat Video rPPG",
            nanda_code: "NANDA 00027",
            disciplines: "Nursing + Nutrition",
            nasa_hazard: "Hostile Closed Environment",
            clinical_benefit: 8.4,
            time_minutes: 10,
            supply_units: 1,
            severity: Severity::Attention,
        });
    }

    if input.orthostatic_dizziness && input.environment != GravityEnvironment::Microgravity0G {
        protocols.push(ClinicalProtocol {
            id: "P5",
            name: "Graded Orthostatic & Vestibular Rehab (Hold EVA)",
            nanda_code: "NANDA 00085",
            disciplines: "Physiotherapy + Nursing",
            nasa_hazard: "Gravity Transition",
            clinical_benefit: 8.6,
            time_minutes: 10,
            supply_units: 0,
            severity: Severity::Critical,
        });
    }

    protocols
}

/// Solves the QUBO formulation:
///   Minimize E(x) = -sum(b_i * x_i) + P * (time_excess^2 + supply_excess^2)
/// Exact solver over binary bitmasks (deterministic, zero-allocation hot path).
fn solve_qubo_triage<'a>(
    protocols: &'a [ClinicalProtocol],
    max_time: u32,
    max_supplies: u32,
) -> (Vec<&'a ClinicalProtocol>, f64) {
    let n = protocols.len();
    let penalty_weight = 2.5_f64;
    let mut best_energy = f64::INFINITY;
    let mut best_mask: usize = 0;

    for mask in 0..(1_usize << n) {
        let mut total_benefit = 0.0;
        let mut total_time = 0_u32;
        let mut total_supplies = 0_u32;

        for (i, proto) in protocols.iter().enumerate() {
            if (mask & (1 << i)) != 0 {
                total_benefit += proto.clinical_benefit;
                total_time += proto.time_minutes;
                total_supplies += proto.supply_units;
            }
        }

        let time_excess = total_time.saturating_sub(max_time) as f64;
        let supply_excess = total_supplies.saturating_sub(max_supplies) as f64;

        let energy = -total_benefit
            + penalty_weight * (time_excess * time_excess * 0.1 + supply_excess * supply_excess);

        if time_excess == 0.0 && supply_excess == 0.0 && energy < best_energy {
            best_energy = energy;
            best_mask = mask;
        }
    }

    let selected = protocols
        .iter()
        .enumerate()
        .filter(|(i, _)| (best_mask & (1 << i)) != 0)
        .map(|(_, p)| p)
        .collect();

    (selected, -best_energy)
}

fn main() {
    let check_in = AnamnesisInput {
        environment: GravityEnvironment::Microgravity0G,
        blurred_vision: true,
        sleep_hours: 4.8,
        high_radiation_dosimeter: true,
        elevated_rppg_hr: true,
        orthostatic_dizziness: false,
    };

    let candidates = evaluate_anamnesis(&check_in);
    let max_time_min = 30;
    let max_supplies = 2;
    let (prioritized, optimized_benefit) = solve_qubo_triage(&candidates, max_time_min, max_supplies);

    println!("=== AstroCare-Q | Spaceflight Clinical & QUBO Triage Engine (Rust) ===");
    println!("Active Environment : {}", check_in.environment.label());
    println!(
        "Mission Constraints: Time <= {} min | Medical Supplies <= {} units\n",
        max_time_min, max_supplies
    );
    println!("Prioritized Multidisciplinary Protocols:");
    for p in prioritized {
        println!(
            "  - [{}] {} ({} | {}) | Hazard: {} | Status: {} | Benefit: {:.1} | Time: {}m | Supplies: {}",
            p.id,
            p.name,
            p.nanda_code,
            p.disciplines,
            p.nasa_hazard,
            p.severity.label(),
            p.clinical_benefit,
            p.time_minutes,
            p.supply_units
        );
    }
    println!("\nTotal Optimized Clinical Benefit: {:.1}", optimized_benefit);
}
