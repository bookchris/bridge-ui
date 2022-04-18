import { Box } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Table } from '../components/table'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Bridge App</title>
      </Head>
      <Box component="main" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>Bridge!</h1>
        <Table />
      </Box>
    </div>
  )
}

export default Home 
