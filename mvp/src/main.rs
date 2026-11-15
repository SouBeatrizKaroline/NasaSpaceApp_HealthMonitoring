//! AstroCare-Q | Spaceflight-Grade Clinical Triage & QUBO Optimizer (Rust)
//!
//! Zero external dependencies: designed for deterministic latency, memory safety
//! without garbage collection, minimal binary footprint, and WASM/embedded portability.

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
    nasa_hazard: &'static str,
    clinical_benefit: f64, // Risk reduction impact (0.0 - 10.0)
    time_minutes: u32,     // Required astronaut time
    supply_units: u32,     // Medical kit units consumed
    severity: Severity,
}

struct AnamnesisInput {
    blurred_vision: bool,
    sleep_hours: f32,
    high_radiation_dosimeter: bool,
    elevated_rppg_hr: bool,
}

/// Evaluates Space Anamnesis + Multimodal inputs into NANDA-I & Medical triage candidates.
fn evaluate_anamnesis(input: &AnamnesisInput) -> Vec<ClinicalProtocol> {
    let mut protocols = Vec::new();

    if input.blurred_vision {
        protocols.push(ClinicalProtocol {
            id: "P1",
            name: "SANS Visual Screening (Amsler Grid) + Sodium Reduction",
            nanda_code: "NANDA 00204",
            nasa_hazard: "Altered Gravity Fields",
            clinical_benefit: 9.2,
            time_minutes: 8,
            supply_units: 0,
            severity: Severity::Critical,
        });
    }

    if input.sleep_hours < 5.5 {
        protocols.push(ClinicalProtocol {
            id: "P2",
            name: "Sleep Hygiene Protocol & 4-7-8 Guided Breathing",
            nanda_code: "NANDA 00198",
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
            name: "Shielded Module Relocation & Skin Barrier Care",
            nanda_code: "NANDA 00046",
            nasa_hazard: "Space Radiation",
            clinical_benefit: 8.7,
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
            nasa_hazard: "Hostile Closed Environment",
            clinical_benefit: 8.5,
            time_minutes: 10,
            supply_units: 1,
            severity: Severity::Attention,
        });
    }

    protocols
}

/// Solves the QUBO formulation:
///   Minimize E(x) = -sum(b_i * x_i) + P * (time_excess^2 + supply_excess^2)
/// Exact solver over binary bitmasks (ultra-fast for <= 20 protocols).
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
    // Simulated post-EVA astronaut check-in (Anamnesis + Quantum Dosimeter + Video rPPG)
    let check_in = AnamnesisInput {
        blurred_vision: true,
        sleep_hours: 4.8,
        high_radiation_dosimeter: true,
        elevated_rppg_hr: true,
    };

    let candidates = evaluate_anamnesis(&check_in);

    let max_time_min = 30;
    let max_supplies = 2;
    let (prioritized, optimized_benefit) = solve_qubo_triage(&candidates, max_time_min, max_supplies);

    println!("=== AstroCare-Q | Spaceflight Clinical & QUBO Triage Engine (Rust) ===");
    println!(
        "Mission Constraints: Time <= {} min | Medical Supplies <= {} units\n",
        max_time_min, max_supplies
    );
    println!("Prioritized Protocols:");
    for p in prioritized {
        println!(
            "  - [{}] {} ({}) | Hazard: {} | Status: {} | Benefit: {:.1} | Time: {}m | Supplies: {}",
            p.id,
            p.name,
            p.nanda_code,
            p.nasa_hazard,
            p.severity.label(),
            p.clinical_benefit,
            p.time_minutes,
            p.supply_units
        );
    }
    println!("\nTotal Optimized Clinical Benefit: {:.1}", optimized_benefit);
}
