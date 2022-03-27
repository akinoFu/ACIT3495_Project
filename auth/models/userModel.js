const database = [
  {
    id: 1,
    name: "test",
    email: "test@gmail.com",
    password: "test123!",
    isAdmin: false
  },
  {
    id: 2,
    name: "cheryl",
    email: "cheryl@gmail.com",
    password: "cheryl123!",
    isAdmin: true
  },
  {
    id: 3,
    name: "akino",
    email: "akino@gmail.com",
    password: "akino123!",
    isAdmin: true
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  createuser: (profile) => {
    let new_user = {'id': profile.id, 'name':  profile.name}
    database.push(new_user)
  },
  isAdmin: (id) =>{
    const user = database.find((user) => user.id === id)
    if(user.status === "admin"){
      return true
    }
    return null
  }
};

module.exports = { database, userModel };
