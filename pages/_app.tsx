import { AppBar, Box, Button, CssBaseline, ThemeProvider, Toolbar, Typography } from '@mui/material'
import type { AppProps } from 'next/app'
import { theme } from '../components/theme'

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppBar
      position="absolute"
      color="secondary"
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h4" color="inherit" noWrap>
          bridge
        </Typography>
        <Box sx={{ display: "flex", ml: 10, gap: 2 }}>
          <Button color="inherit" href="/">Play</Button>
          <Button color="inherit" href="/analysis">Analysis</Button>
        </Box>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
