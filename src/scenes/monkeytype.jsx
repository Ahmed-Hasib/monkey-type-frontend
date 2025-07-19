import { Box, Button, Card, CardActionArea, CardContent, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { tokens } from "../theme";
import LinearProgress from "@mui/material/LinearProgress";


const dummyParagraphs = [
    { id: 1, text: "I like to make money by typing fast and accurately." },
    { id: 2, text: "The quick brown fox jumps over the lazy dog." },
    { id: 3, text: "Practice makes perfect, so keep typing daily." },
    { id: 4, text: "Typing speed improves with consistency and focus." },
];

const MonkeyType = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const totalTime = 10;

    const [paragraph, setParagraph] = useState("");
    const [typed, setTyped] = useState("");
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [isLocked, setIsLocked] = useState(false);
    const inputRef = useRef(null);

    // Load paragraph and reset timer
    useEffect(() => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * dummyParagraphs.length);
            setParagraph(dummyParagraphs[randomIndex].text);
            setLoading(false);
            setTyped("");
            setTimeLeft(totalTime);
            setIsLocked(false);
            inputRef.current?.focus();
        }, 500);
    }, []);

    // Timer countdown
    useEffect(() => {
        if (loading || isLocked) return;

        if (timeLeft <= 0) {
            setIsLocked(true);
            return;
        }

        const timerId = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [timeLeft, loading, isLocked]);

    const handleChange = (e) => {
        if (isLocked) return;
        const inputValue = e.target.value;
        if (inputValue.length <= paragraph.length) {
            setTyped(inputValue);
        }
    };

    const handleRestart = () => {
        setTyped("");
        setTimeLeft(totalTime);
        setIsLocked(false);
        inputRef.current.focus();
    };

    const handleChangeParagraph = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * dummyParagraphs.length);
        } while (dummyParagraphs[newIndex].text === paragraph);

        setParagraph(dummyParagraphs[newIndex].text);
        setTyped("");
        setTimeLeft(totalTime);
        setIsLocked(false);
        inputRef.current.focus();
    };

    const getResults = () => {
        let correct = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === paragraph[i]) correct++;
        }
        const total = paragraph.length;
        const incorrect = total - correct;
        const accuracy = ((correct / total) * 100).toFixed(2);

        const wordsTyped = typed.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped / (totalTime / 60)));
        return { total, correct, incorrect, accuracy, wpm };
    };

    const isComplete = typed.length === paragraph.length || isLocked;
    const result = isComplete ? getResults() : null;




    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ padding: 4 }}
            onClick={() => inputRef.current?.focus()}
        >
            <Box display="flex" width="80%">
                <Box sx={{ width: "80%", mt: 3 }}>
                    <LinearProgress
                        variant="determinate"
                        value={(timeLeft / totalTime) * 100}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: colors.grey[600],
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: colors.primary[100],
                            },
                        }}
                    />
                </Box>
                <Typography sx={{ fontWeight: "bold", fontSize: 40, textAlign: "right", width: "20%", }} color={colors.grey[600]}>
                    {timeLeft} {timeLeft !== 1 ? "S" : ""}
                </Typography>

            </Box>
            {loading ? (
                <Box sx={{ width: "80%", maxWidth: "800px", marginBottom: 2 }}>
                    <Skeleton animation="wave" height={totalTime} />
                    <Skeleton animation="wave" height={25} width="90%" />
                    <Skeleton animation="wave" height={20} width="85%" />
                </Box>
            ) : (
                <>



                    <Box
                        sx={{
                            fontSize: "40px",
                            fontFamily: "monospace",
                            padding: 2,
                            borderRadius: 2,
                            width: "80%",
                            userSelect: "none",
                            cursor: "text",
                            whiteSpace: "pre-wrap",
                            border: "1px solid",
                            borderColor: colors.grey[700],
                        }}
                    >
                        {paragraph.split("").map((char, index) => {
                            const typedChar = typed[index];
                            const isCurrent = index === typed.length && !isLocked;
                            const isCorrect = typedChar === char;

                            return (
                                <Box
                                    key={index}
                                    component="span"
                                    sx={{
                                        color: typedChar
                                            ? isCorrect
                                                ? "green"
                                                : "red"
                                            : colors.grey[100],
                                        position: "relative",
                                    }}
                                    className={isCurrent ? "cursor" : ""}
                                >
                                    {char}
                                    {isCurrent && (
                                        <Box
                                            component="span"
                                            sx={{
                                                position: "absolute",
                                                right: -1,
                                                animation: "blink 1s step-start infinite",
                                                "@keyframes blink": {
                                                    "50%": { opacity: 0 },
                                                },
                                            }}
                                        >
                                            |
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>


                </>
            )}

            {/* Hidden input to capture typing */}
            <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleChange}
                disabled={isLocked}
                style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />

            <Box display="flex" justifyContent="flex-end" width="80%">
                <Button
                    variant="outlined"
                    color={colors.primary[400]}
                    onClick={handleRestart}
                    sx={{ marginTop: 2 }}
                >
                    Restart
                </Button>

                <Button
                    variant="outlined"
                    color={colors.primary[400]}
                    sx={{ marginTop: 2, marginLeft: 1 }}

                    onClick={handleChangeParagraph}
                >
                    Change
                </Button>
            </Box>

            {isComplete && result && (
                <Box sx={{ marginTop: 4, textAlign: "center", width: "80%" }}>

                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                            gap: 2,
                        }}
                    >



                    </Box>
                    <Box sx={{ width: "100%", mt: 4 }}>
                        <Typography variant="h6" gutterBottom textAlign='start'>

                        </Typography>


                        <Grid container spacing={1}>


                            <Grid item xs={12} sm={6} md={3} width="40%" >
                                <Card sx={{ textAlign: "end", borderRadius: 2, background: "none" }} >
                                    <CardContent >
                                        <Typography variant="h6" fontSize={60}>{result.wpm}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize={20} textAlign="end" color={colors.grey[200]}>
                                            WPM
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} width="40%" >
                                <Card sx={{ textAlign: "end", borderRadius: 2, background: "none" }} >
                                    <CardContent >
                                        <Typography variant="h6" fontSize={60}>{result.accuracy}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize={20} textAlign="end" color={colors.grey[200]}>
                                            Typography
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3} width="30%" >
                                <Card sx={{ textAlign: "end", borderRadius: 2, background: "none" }} >
                                    <CardContent >
                                        <Typography variant="h6" fontSize={60}>{result.total}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize={20} textAlign="end" color={colors.grey[200]}>
                                            Total
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>



                            <Grid item xs={12} sm={6} md={3} width="30%" >
                                <Card sx={{ textAlign: "end", borderRadius: 2, background: "none" }} >
                                    <CardContent >
                                        <Typography variant="h6" fontSize={60}>{result.correct}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize={20} textAlign="end" color={colors.grey[200]}>
                                            Correct
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3} width="30%" >
                                <Card sx={{ textAlign: "end", borderRadius: 2, background: "none" }} >
                                    <CardContent >
                                        <Typography variant="h6" fontSize={60}>{result.incorrect}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize={20} textAlign="end" color={colors.grey[200]}>
                                            Incorrect
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>








                        </Grid>
                    </Box>


                </Box>
            )}
        </Box>
    );
};

export default MonkeyType;
