import dbConnectHandler from '../../utils/dbConnectHandler'
import Image from '../../models/Image'

export default dbConnectHandler(async (req, res) => {

  const { data } = req.body 

  try {
    const image = await Image.create({ image: data })
    if (image) res.status(200).json({ success: true, id: image._id })
    else res.status(400).json({ success: false })
  } catch (error) {
    console.log(error);
    res.json({ success: false })
  }

})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}