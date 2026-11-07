
const INAPPROPRIATE_WORDS = [
    // English profanity
    "fuck",
    "fucking",
    "fucked",
    "fucker",
    "fuckers",
    "motherfucker",
    "motherfucking",
    "shit",
    "shitty",
    "bullshit",
    "bitch",
    "bitches",
    "bitching",
    "asshole",
    "assholes",
    "bastard",
    "bastards",
    "dick",
    "dickhead",
    "pussy",
    "cunt",
    "slut",
    "whore",
    "nigga",
    "nigger",
    "retard",
    "niggas",
    "niggers",
    "retards",

    // Filipino / Tagalog profanity and insults
    "puta",
    "putangina",
    "putang ina",
    "tangina",
    "tang ina",
    "tanginamo",
    "tang ina mo",
    "putanginamo",
    "putang ina mo",
    "pucha",
    "punyeta",
    "pakshet",
    "pakshit",
    "gago",
    "gaga",
    "gag0",
    "tanga",
    "bobo",
    "ulol",
    "tarantado",
    "kupal",
    "leche",
    "lintik",
    "bwisit",
    "hindot",
    "kantot",
    "puki",
    "puke",
] as const;

// Escape special regex characters in each word.
// Spaces in phrases can also match repeated whitespace.
const escapedWords = INAPPROPRIATE_WORDS.map((word) =>
    word
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+")
);

// Match complete words or phrases, not substrings
// inside longer words.
const INAPPROPRIATE_WORDS_REGEX = new RegExp(
    `(^|[^a-zA-Z0-9_])(?:${escapedWords.join("|")})(?=$|[^a-zA-Z0-9_])`,
    "i"
);

export function containsInappropriateWord(
    text: string
): boolean {
    return INAPPROPRIATE_WORDS_REGEX.test(text);
}
