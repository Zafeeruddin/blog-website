import db from '../db';

const seedUsers=async()=>{
    try{
        await db.user.create({
            data:{
                id: "a",
                name:"test1",
                email:"test1@gmail.com",
                password:"123456"
            }
        })
        await db.user.create({
            data:{
                id:"b",
                name:"test2",
                email:"test2@gmail.com",
                password:"123456"
            }
        })
    }catch(e){
        console.error("Error adding users")
        throw e
    }   
}

const seedPosts= async()=>{
    try{
        await db.post.create({
            data:{
                authorId:"a",
                title:"Renaissance at mid-night",
                content:"How the first perosn in the world created the ruckus blah blah blah blah blah blah blah blah blah blah blah blah"
            }
        })   
        await db.post.create({
            data:{
                authorId:"a",
                title:"Renaissance at mid-night",
                content:"How the first perosn in the world created the ruckus blah blah blah blah blah blah blah blah blah blah blah blah"
            }
        })   
        await db.post.create({
            data:{
                authorId:"b",
                title:"Renaissance at night",
                content:"How the first perosn in the world created the ruckus blah blah blah blah blah blah blah blah blah blah blah blah"
            }
        })   
        await db.post.create({
            data:{
                authorId:"b",
                title:"Renaissance at afternoon",
                content:"How the first perosn in the world created the ruckus blah blah blah blah blah blah blah blah blah blah blah blah"
            }
        })   
    }catch(e){
        console.error("Error creating posts")
        throw e
    }
}

const seedData=async ()=>{
    try{
    await seedUsers()
    await seedPosts()
    }catch(e){
        console.error("Error seeding db")
        throw e
    }finally{
        db.$disconnect()
    }
}

seedData().catch((e)=>{
    console.error("Error seeding")
})