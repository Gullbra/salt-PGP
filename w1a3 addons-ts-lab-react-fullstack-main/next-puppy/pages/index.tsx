// import Head from 'next/head'
// import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <>
      <Layout>
        <Link href={"/MongoTest"}>
          <button className='btn'>
            Click to Test
          </button>
        </Link>
      </Layout>
    </>
  )
}
