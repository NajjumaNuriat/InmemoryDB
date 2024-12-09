class InMemoryDB {
  constructor(schema) {
    this.storeddata = new Map(); // map for storage and retrival of data
    this.counter = 1; // initialize counter for employee ids
    this.schema = schema; //define the structure of data expected for employess table
  }
  validateData(item) {
    const schemaKeys = Object.keys(this.schema);
    const itemKeys = Object.keys(item);
    for (let key of schemaKeys) {
      // for every field in the table(schema definition)
      if (!item.hasOwnProperty(key)) {
        //if u miss adding a specific feild for the employee data
        throw new Error(`Missing field: ${key}`);
      }
      if (typeof item[key] !== this.schema[key]) {
        // if item doesnt match the feild in the database schema
        ("");
        throw new Error(
          `Invalid type for field: ${key}. Expected ${
            //returns a message invalid field and expected correct data
            this.schema[key]
          } but got ${typeof item[key]}` // returns message but got the invalid data u entered
        );
      }
    }
    for (let key of itemKeys) {
      if (!schemaKeys.includes(key)) {
        // if schema definition doesnt include the data u entered
        throw new Error(`Unexpected field: ${key}`);
      }
    }
  }
  checkDuplicateData(name, age) {
    // Check for duplicate values of name (in lowercase) and age

    const lowercaseName = name.toLowerCase(); // Convert input name to lowercase

    for (let item of this.storeddata.values()) {
      // For every employee stored in a map
      if (item.name.toLowerCase() === lowercaseName && item.age === age) {
        return true; // Duplicate name and age found
      }
    }
    return false; // No duplicates found
  }
  getNextEmployeeId() {
    // autogenerates Employee ids from a counter
    if (this.counter > 30) {
      throw new Error("Employee ID limit exceeded. Cannot generate more IDs.");
    }
    const id = this.counter;
    //this.counter = this.counter === 30 ? 1 : this.counter + 1; // increament counter in every call till the 30th call

    // Increment counter
    this.counter += 1;

    return id;
  }
  addEmployee(item) {
    try {
      if (this.checkDuplicateData(item.name, item.age)) {
        throw new Error(
          `Duplicate entry: Employee with name "${item.name}" and age ${item.age} already exists.`
        );
      }

      item.id = this.getNextEmployeeId(); // Get the next EmployeeID from the counter
      this.validateData(item); //validate data before adding to the map
      this.storeddata.set(item.id, {
        ...item,
        created_at: new Date().toISOString(), //set date when employee is created
      });
      return item;
    } catch (error) {
      return { error: error.message };
    }
  }
  getEmployeebyId(id) {
    return this.storeddata.get(id) || null; // return datastored in a map by id
  }
  deleteEmployeebyId(id) {
    if (this.storeddata.has(id)) {
      //if the map contains employee data with that id
      this.storeddata.delete(id); // delete item from map by id
      return true;
    }
    return false;
  }
  updateEmployee(id, updatedFields) {
    const item = this.storeddata.get(id);
    if (!item) {
      // if employee with id doesnt exist
      return {
        error: `Employee with ID: ${id} not found. please add new Employee`,
      };
    }
    Object.assign(item, updatedFields, {
      //assign new values to the map
      updated_at: new Date().toISOString(), // returns the date when data is updated
    });
    return item; // return updated data
  }
  getAllEmployeesDetails() {
    return Array.from(this.storeddata.values());
  }
  clearAllEmployeesDetails() {
    this.storeddata.clear();
    return true;
  }
}
const schema = {
  id: "number",
  name: "string",
  age: "number",
};

const db = new InMemoryDB(schema); //creates the database
// Add Employee Handler
document.getElementById("addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);

  const newItem = { name, age };
  const result = db.addEmployee(newItem);
  displayMessage(result);
});
// Get Employee Handler
document.getElementById("getForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("getId").value);
  const item = db.getEmployeebyId(id);
  displayMessage(item ? item : `Employee with ID ${id} not found.`);
});
// Update Employee Handler
document.getElementById("updateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("updateId").value);
  const name = document.getElementById("updateName").value;
  const age = document.getElementById("updateAge").value;

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (age) updatedFields.age = parseInt(age);

  const result = db.updateEmployee(id, updatedFields);
  displayMessage(result);
});
// Delete Employee Handler
document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("deleteId").value);
  const result = db.deleteEmployeebyId(id);
  displayMessage(
    result
      ? `Employee with ID ${id} deleted.`
      : `Employee with ID ${id} not found.`
  );
});
// Retrieve all Employees in tha database
function displayAllEmployees() {
  const items = db.getAllEmployeesDetails();
  let output = "<h3>All Employees</h3><ul>";
  items.forEach((item) => {
    output += `<li>ID: ${item.id}, Name: ${item.name}, Age: ${item.age}</li>`;
  });
  output += "</ul>";
  document.getElementById("output").innerHTML = output;
}

// Remove All Emploees from the database
function clearAllEmployees() {
  const result = db.clearAllEmployeesDetails();
  displayMessage(
    result ? "All employees have been removed." : "Error clearing items."
  );
}
// Display Messages
function displayMessage(message) {
  const output = document.getElementById("output");
  if (message.error) {
    output.innerHTML = `<p class="error">${message.error}</p>`;
  } else {
    output.innerHTML = `<p class="success">${JSON.stringify(message)}</p>`;
  }
}
localStorage.setItem("my database", JSON.stringify({ age: 20 }));
const data = localStorage.getItem("my database");
console.log(JSON.parse(data));
