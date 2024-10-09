import React, { useState } from 'react';
import { Container, TextField, Button, CircularProgress, Typography, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LinkedIn, YouTube, Description } from '@mui/icons-material';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleProcess = async (transcriptionType: string) => {
    if (!transcription) {
      alert('Por favor, introduce una transcripción.');
      return;
    }

    setLoading(transcriptionType);
    setSummary('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcription, transcriptionType }),
      });

      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
      } else if (data.response) {
        setSummary(data.response);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el texto.');
    } finally {
      setLoading(null);
    }
  };

  const formatSummary = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <div
        key={index}
        className="formatted-line"
        style={{ color: '#ffffff', lineHeight: '2', marginTop: '1em' }}
      >
        {line.split('**').map((segment, i) => (
          i % 2 === 1 ? <strong key={i} style={{ color: '#64b5f6', fontSize: '1.25em' }}>{segment}</strong> : <span key={i}>{segment}</span>
        ))}
      </div>
    ));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Text Transcriber
          </Typography>
          <Typography variant="body1">
            Enter the text below to process it and get an automatically generated summary.
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Transcripción"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            disabled={loading !== null}
          />
        </Box>
        <Box sx={{ mb: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: '#fefa6d', color: '#000000' }}
            startIcon={<YouTube />}
            onClick={() => handleProcess('shorts')}
            disabled={loading !== null}
          >
            {loading === 'cortos' ? 'Procesando...' : 'Shorts ideas'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: '#8db6ff', color: '#000000' }}
            startIcon={<LinkedIn />}
            onClick={() => handleProcess('linkedin')}
            disabled={loading !== null}
          >
            {loading === 'linkedin' ? 'Procesando...' : 'Posts Linkedin'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: '#c79bff', color: '#000000' }}
            startIcon={<Description />}
            onClick={() => handleProcess('detail')}
            disabled={loading !== null}
          >
            {loading === 'detalle' ? 'Procesando...' : 'Give me all details'}
          </Button>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {summary && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
              Resumen
            </Typography>
            <Box className="formatted-summary" style={{ backgroundColor: '#121212', padding: '15px', borderRadius: '10px' }}>
              {formatSummary(summary)}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;