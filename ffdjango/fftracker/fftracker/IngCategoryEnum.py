from enum import Enum

class ParentCategory(Enum):
    NoCategory = 0
    Fruits = 1
    Vegetables = 2
    Dairy = 3
    Protein = 4
    Grains = 5
    Specialty = 6
    Condiments = 7

class SpecificCategory(Enum):
    NoCategory = 0
    Melons = 1
    Berries = 2
    OtherFruits = 3
    DarkgreenVegetables = 4
    RedOrangeVegetables = 5
    StarchyVegetables = 6
    BeansPeasLentils = 7
    OtherVegetables = 8
    Milk = 9
    Cheese = 10
    Yogurt = 11
    NonDairyCalciumAlternatives = 12
    Meats = 13
    Poultry = 14
    Seafood = 15
    Eggs = 16
    NutsSeeds = 17
    BeansPeasLentilsProtein = 18
    WholeGrains = 19
    RefinedGrains = 20
    GlutenFree = 21
    Vegan = 22
    Allergies = 23
    Sauces = 24
    Seasonings = 25
    Broths = 26