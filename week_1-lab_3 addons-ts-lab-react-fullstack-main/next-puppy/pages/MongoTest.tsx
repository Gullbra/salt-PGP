// import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Layout from '../components/Layout'
// import ServerComponent from '../components/SComponent'


export async function getServerSideProps(
  // context
) {
  let res = await fetch("http://localhost:3000/api/testing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allPups = await res.json();

  if (res.status == 200) {
    return {
      props: { allPups, isConnected: true},
    };

  } else {
    return {
      props: { isConnected: false },
    }
  }
}

export default function MongoTest(
  {isConnected}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <Layout>
      {/* <ServerComponent /> */}
      {isConnected 
        ? (
          <h2 className="subtitle">
            You are connected to MongoDB
          </h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
            for instructions.
          </h2>
        )
      }
    </Layout>
  )
}