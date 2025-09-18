import express, { json } from "express"

const PORT=8000

const app=express()
app.use(json())

let books = [
  { id: 1, title: "Egri csillagok", author: "Gárdonyi Géza", available: 3 },
  { id: 2, title: "Pál utcai fiúk", author: "Molnár Ferenc", available: 2 },
  { id: 3, title: "Tüskevár", author: "Fekete István", available: 4 },
  { id: 4, title: "Harry Potter", author: "J K Rowling", available: 0 }
];

app.get("/books",(req,res)=>{
    if(books.length==0){
        return res.status(200).json({msg:"A könyvtár üres"})
    }
    res.status(200).json(books)
})

app.post("/books",(req,res)=>{
    const {title, author, available} = req.body
    const id = Date.now()
    books.push({id,title, author, available})

    return res.status(201).json({msg:"Könyv hozzáadva!"})

})

app.delete("/books/:id",(req,res)=>{
    const {id} = req.params
    const itemIndex = books.findIndex(obj=>obj.id == id)
    if(itemIndex ==-1){
        return res.status(404).json({msg:"Nem található a könyv!"})
    }
    
    books = books.filter(obj=>obj.id != id)
    res.status(200).json({msg:"A könyv eltávolítva!"})
})

app.patch("/books/borrow/:id",(req,res)=>{
     const {id} = req.params
     const {available} = req.body
     const itemIndex = books.findIndex(obj=>obj.id == id)
     if(itemIndex ==-1 ){
        return res.status(404).json({msg:"Nincs ilyen könyv!"})
     }else if(books[itemIndex].available==0) {
        return res.status(400).json({msg:"Nincs több példány elérhető🥀"})
     }

     books[itemIndex].available = available-1

     return res.status(200).json({msg:`Kikölcsönözve: ${books[itemIndex].title} available: ${books[itemIndex].available}`})
})

app.patch("/books/return/:id",(req,res)=>{
     const {id} = req.params
     const {available} = req.body
     const itemIndex = books.findIndex(obj=>obj.id == id)
     if(itemIndex ==-1 ){
        return res.status(404).json({msg:"Nincs ilyen könyv!"})
     }

     books[itemIndex].available = available+1

     return res.status(200).json({msg:`Visszahozva: ${books[itemIndex].title} available: ${books[itemIndex].available}`})
})

app.get("/books/available",(req,res)=>{
    const total = books.reduce((acc,obj)=>obj.available+ acc , 0)
    const availableBooks = books.filter(obj=>obj.available>0)
    if(total==0){
        return res.status(200).json({msg:"Jelenleg nincs elérhető könyv!🥀"})
    }else{
        return res.status(200).json(availableBooks)
    }
})



app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))
