import dbConnect from '../utils/dbConnect';
import Image from '../models/Image';

const Index = ({ success, image }) => {

  if (!success) return <h1 className="p-4 font-bold text-2xl">404: image does not exist</h1>

  return <>
    <img src={image}/>
  </>
}

export async function getServerSideProps({ query: { id }}) {
  await dbConnect()

  try {
    const data = await Image.findById(id)
    if (data) return { props: { success: true, image: data.image } }
    else return { props: { success: false } }
  } catch (error) {
    return { props: { success: false } }
  }
}

export default Index