use std::error::Error;

#[derive(Debug)]
pub enum SessionError {
    HttpError(reqwest::Error),
    RegexError(regex::Error),
    PatternNotFound,
    Custom(String),
    AuthFailed(String),
}

impl std::fmt::Display for SessionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SessionError::HttpError(e) => write!(f, "HTTP error: {}", e),
            SessionError::RegexError(e) => write!(f, "Regex error: {}", e),
            SessionError::PatternNotFound => write!(f, "Pattern not found in response"),
            SessionError::Custom(e) => write!(f, "{}", e),
            SessionError::AuthFailed(e) => write!(f, "{}", e),
        }
    }
}

impl Error for SessionError {}

impl From<reqwest::Error> for SessionError {
    fn from(error: reqwest::Error) -> Self {
        SessionError::HttpError(error)
    }
}

impl From<regex::Error> for SessionError {
    fn from(error: regex::Error) -> Self {
        SessionError::RegexError(error)
    }
}
