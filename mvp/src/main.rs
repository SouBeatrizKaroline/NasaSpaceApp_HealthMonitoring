#![forbid(unsafe_code)]

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ReviewPreference {
    RoutineEntry,
    ReviewRequested,
    MissionProcedureSelected,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RecordState {
    Incomplete,
    Recorded,
    ReviewRequested,
    ProcedureSelected,
}

/// Administrative record state only. It does not assess health or urgency.
pub fn record_state(
    has_context: bool,
    has_report: bool,
    preference: ReviewPreference,
) -> RecordState {
    if !has_context || !has_report {
        return RecordState::Incomplete;
    }

    match preference {
        ReviewPreference::RoutineEntry => RecordState::Recorded,
        ReviewPreference::ReviewRequested => RecordState::ReviewRequested,
        ReviewPreference::MissionProcedureSelected => RecordState::ProcedureSelected,
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Observation<T> {
    pub value: Option<T>,
    pub unit: Option<String>,
    pub source: Option<String>,
    pub recorded_at_utc: String,
}

impl<T> Observation<T> {
    pub fn is_present(&self) -> bool {
        self.value.is_some()
    }
}

fn main() {
    let state = record_state(true, true, ReviewPreference::ReviewRequested);
    println!("Record workflow state: {state:?}");
}