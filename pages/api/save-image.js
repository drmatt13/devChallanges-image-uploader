import fs from 'fs'

export default function handler(req, res) {
  const { data, name } = req.body
  if (data ) fs.writeFile(`./public/images/${name}`, data.split(',').slice(1).join(','), 'base64', (error) => {
    if (error) {
      console.log(error)
      res.status(200).json({ success: false })
    } else res.status(200).json({ success: true })
  })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
