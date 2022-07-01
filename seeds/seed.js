const mongoose = require("mongoose");
const Campground = require("../models/campground")
const cities = require("./cities")
const { descriptors, places, images } = require("./seedHelpers")

// DB connection
main()
    .then(() => console.log("Mongo connection open"))
    .catch(err => console.log("Mongo connection error", err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/campgrounds');
}

// Takes in array randomly picks some index and returns that value at the index
const indexGenerator = (array) => array[Math.floor(Math.random() * array.length)];
const priceGenerator = () => (Math.random() * 200).toFixed(1) + 10;
const imageGenerator = () => Math.floor(Math.random() * 12 + 1)

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${indexGenerator(descriptors)}, ${indexGenerator(places)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            image: `${indexGenerator(images)}`,
            price: priceGenerator(),
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id maximus dui, eu condimentum justo. In pulvinar nibh in aliquet tincidunt. Nulla posuere, ligula nec.",
            author: "62bb8e7317619537c76b85b6",
            geometry: {
                type: "Point",
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            }
        });
        await camp.save();
    }
}

seedDB()
    .then(() => mongoose.connection.close())