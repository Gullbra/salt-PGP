// import Head from 'next/head'
import Layout from '../components/Layout'
import { useEffect, useRef, useState } from 'react'
// import utilStyles from '../styles/utils.module.css'
// import Link from 'next/link'
// import Date from '../components/date'
import { GetStaticProps } from 'next'
import axios from 'axios'


interface IRandomUser {
  location: {
    street: {
      number: number
      name: string
    }
    city: string
    country: string
  }
  dob: {age: number}
  name: {
    title: string
    first: string
    last: string
  }
  //mail: string
}

export default function Home(
  {}: {}
) {
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ randomUser, setRandomUser ] = useState<IRandomUser | null>(null)
  const [ editingMode, setEditingMode ] = useState<boolean>(false)
  const [ editingState, setEditingState] = useState<IRandomUser | null>(null)

  const refName = useRef<HTMLInputElement>(null)
  const refAge = useRef<HTMLInputElement>(null)
  const refStrNumber = useRef<HTMLInputElement>(null)
  const refStreet = useRef<HTMLInputElement>(null)
  const refCity = useRef<HTMLInputElement>(null)
  const refCountry = useRef<HTMLInputElement>(null)

  const fetcheroo = () => {
    axios('https://randomuser.me/api/')
      .then(res => {
        const newRandomUser: IRandomUser = {...res.data.results[0]}
        setRandomUser(newRandomUser)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if(!randomUser){
      fetcheroo()
    }
  },[])

  const buttonHandler = () => {
    setIsLoading(true)
    fetcheroo()
  }
  
  const formHandler = () => {
    console.log('Wasauo man?')
  }

  return (
    <Layout home>

      {isLoading 
        ? <p>it's loading!</p>
        :(

          randomUser && !editingMode && (
            <>
              <p>{`Name: ${randomUser.name.title} ${randomUser.name.first} ${randomUser.name.last}`}</p>
              <p>{`Age: ${randomUser.dob.age}`}</p>
              <p>{`Address:`}</p>
              <ul style={{listStyle:"none"}}>
                <li>{`\n\tStreet: ${randomUser.location.street.number} ${randomUser.location.street.name}`}</li>
                <li>{`\n\tCity: ${randomUser.location.city}`}</li>
                <li>{`\n\tCountry: ${randomUser.location.country}`}</li>
              </ul>
            </>
          )

        )
      } 
      {randomUser && editingMode && (
        <form onSubmit={() => formHandler()}>
          <ul style={{listStyle:"none"}}>

            <li>
              <label htmlFor="inpName">Name:</label>
              <input type="text" id='inpName' ref={refName}
              />
            </li>

            <li>
              <label htmlFor="inpAge">Age:</label>
              <input type="number" id='inpAge' ref={refAge}
                value={editingState.dob.age}
                onChange={event => {
                  const newState = {...editingState}
                  newState.dob.age = Number(event.target.value)
                  setEditingState(newState)
                }}
              />
            </li>

            <li>
              <ul style={{listStyle:"none"}}>
                <li>
                  <label htmlFor="inpStrNumber">StrNumber:</label>
                  <input type="number" id='inpStrNumber' ref={refStrNumber} />
                </li>
                <li>
                  <label htmlFor="inpStreet">Street:</label>
                  <input type="text" id='inpStreet' ref={refStreet} />
                </li>
                <li>
                  <label htmlFor="inpCity">City:</label>
                  <input type="text" id='inpCity' ref={refCity} />
                </li>
                <li>
                  <label htmlFor="inpCountry">Country:</label>
                  <input type="text" id='inpCountry' ref={refCountry} />
                </li>
              </ul>
            </li>
          </ul>
        </form>
      )}     

      
      {!editingMode && (
        <button
          onClick={()=>buttonHandler()}
        >Click To Fetch New!</button>
      )}

      <button
        onClick={()=>{
          setEditingState({...randomUser})
          setEditingMode(!editingMode)
        }}
      >{editingMode ? "Stop editing" : "Edit"}</button>

      {/*
      <section className={utilStyles.headingMd}>
        <p>Just a good dude</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section> */}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
    }
  }
}
