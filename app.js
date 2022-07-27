const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/mealPlannerDB", {useNewUrlParser: true});

const userRecordedDate = new Date()

const foodSchema = mongoose.model({
  name: String,
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fat: Number,
  acceptedUnits: Number,
  itemWeight: Number
});

const mealSchema = mongoose.model({
  // category: Breakfast-depends on time
  category: String,
  name: String,
  foodItems: [foodSchema]
});

const userSchema = mongoose.model({
  name: String,
  calorieRequirement: Number,
  mealPlan: [[Date, mealSchema]]
});

const Food = mongoose.model("Food", foodSchema);
const foodItems = [];

const Meal = mongoose.model("Meal", mealSchema);
const mealItems = [];

const User = mongoose.model("User", userSchema);

//Food Items
const Milk = new Food({
  name: "Milk",
  calories: 65,
  protein: 3.3,
  carbohydrates: 5,
  fat: 4,
  acceptedUnits: 1,
  itemWeight: 155
});

const Eggs = new Food({
  name: "Eggs",
  calories: 150,
  protein: 12,
  carbohydrates: 0,
  fat: 11,
  acceptedUnits: 1,
  itemWeight: 200
});

const Chicken = new Food({
  name: "Chicken",
  calories: 150,
  protein: 25,
  carbohydrates: 0,
  fat: 5,
  acceptedUnits: 3,
  itemWeight: 63
});

const Rice = new Food({
  name: "Rice",
  calories: 120,
  protein: 2,
  carbohydrates: 30,
  fat: 5,
  acceptedUnits: 1,
  itemWeight: 108
});

//Meal Items
const Breakfast = Meal({
  category: "Breakfast",
  name: "Breakfast",
  foodItems: [Milk, Eggs]
});

const Lunch = Meal({
  category: "Lunch",
  name: "Lunch",
  foodItems: [Chicken, Rice]
});

//Users
const date1 = new Date('December 17, 2021 03:24:00');
const date2 = new Date('December 18, 2021 03:24:00');

const Rahul = User({
  name: "Rahul",
  calorieRequirement: 500,
  mealPlan: [[date1, [Breakfast, Lunch]], [[date2, [Breakfast, Lunch]]]]
})

//Add food item
app.post("/addfooditem", function(req, res){

  const foodItem = new Food({
    name:req.body.foodName,
    calories: req.body.foodCalories,
    protein: req.body.foodProtein,
    carbohydrates: req.body.foodCarbohydrates,
    fat: req.body.foodFat,
    acceptedUnits: req.body.foodAcceptedUnits,
    itemWeight: req.body.foodItemWeight 
  });
  foodItem.save();

  // foodItems.push(foodItem);
});

//Add meal item
app.post("/addmealitem", function(req, res){
  const mealItem = new Meal({
    name: req.body.mealName,
    category: req.body.mealCategory,
    foodItems: req.body.mealFoodItems
  });
  mealItem.save();

  // mealItems.push(mealItem);
});

//Add user
app.post("/adduser", function(req,res){
  const user = new User({
    name: req.body.username,
    calorieRequirement: req.user.calorieRequirement,
    mealPlan: req.user.mealPlan
  });
  user.save();
});

//Update meal for a user
app.patch("/updateuser/:username", function(req,res){
  User.updateOne(
    {name: req.params.username},
    {$set: req.body}
  );
});

//Algorithm

