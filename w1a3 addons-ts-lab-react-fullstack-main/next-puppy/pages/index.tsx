// import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>
      <Layout>
        <main>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed voluptatibus obcaecati, numquam nesciunt perferendis eius dignissimos maiores omnis dicta hic, officiis esse deleniti ducimus, voluptates inventore odio! Unde eligendi tempore iste beatae rem, sequi quibusdam deleniti exercitationem officiis, quae numquam animi esse praesentium autem delectus in minima accusantium commodi, culpa et. Doloribus natus, doloremque numquam fugit ut aperiam architecto, molestias voluptas distinctio ex libero rem laborum corporis dolor, eveniet qui eum earum? Est illo, delectus sit numquam placeat ipsam omnis. Rem natus voluptate maxime placeat expedita dolor, sint ad quia rerum ab repellendus, accusantium voluptatum quibusdam atque molestias deserunt minus?
        </main>
      </Layout>
    </div>
  )
}
