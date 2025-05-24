import { eq } from "drizzle-orm";
import db from "./Drizzle/db";
import { CarTable, CustomerTable, LocationTable, TICustomer, TSCustomer } from "./Drizzle/schema";

const getAllCustomers = async () => {
    return await db.query.CustomerTable.findMany()
}

const getCustomerById = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID)
    })
}

// customerwith reservations
const getCustomerWithReservations = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID),
        with: {
            reservations: true
        }
    })
}

// customer with bookings
const getCustomerWithBookings = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID),
        with: {
            bookings: {
                columns: {
                    carID: true,
                    rentalStartDate: true,
                    rentalEndDate: true,
                    totalAmount: true
                }
            }
        }
    })
}

// using select queries to fetch customers with specific details
const getCustomerWithSelectedDetails = async (customerID: number) => {
    return await db.select({
        firstName: CustomerTable.firstName,
        lastName: CustomerTable.lastName,
        email: CustomerTable.email,
        phoneNumber: CustomerTable.phoneNumber
    })
        .from(CustomerTable)
        .where(eq(CustomerTable.customerID, customerID));
}

// Fetching locations with all cars available at that location
const getLocationsWithCars = async () => {
    return await db.query.LocationTable.findMany({
        with: {
            cars: {
                columns: {
                    carModel: true,
                    color: true,
                    rentalRate: true,
                    availability: true
                }
            }
        }
    })
}

// Fetching mentaenance for all cars
const getCarsWithMaintenance = async () => {
    return await db.query.CarTable.findMany({
        with: {
            maintenanceRecords: {
                columns: {
                    description: true,
                    maintenanceDate: true,
                    cost: true
                }
            }
        }
    })
}


// -------Insert Customer

const newCustomer = {
    firstName: "Brian",
    lastName: "Kemboi",
    email: "kemboi@gmail.com",
    phoneNumber: "0712345678",
    address: "10 River Rd"
};

const insertCustomer = async (customer: TICustomer) => {
    const insertedCustomer = await db.insert(CustomerTable).values(customer).returning();
    return insertedCustomer;
}


// update the user
const updateCustomer = async (email: string, updatedData: Partial<TICustomer>) => {
    const updatedCustomer = await db.update(CustomerTable)
        .set(updatedData)
        .where(eq(CustomerTable.email, email))
        .returning();
    return updatedCustomer;
}

// delete a customer
const deleteCustomer = async (customerID: number) => {
    const deletedCustomer = await db.delete(CustomerTable)
        .where(eq(CustomerTable.customerID, customerID))
        .returning();
    return deletedCustomer;
}


async function main() {


    // ............Fetch all customers
    // const customers = await getAllCustomers();
    // console.log(customers);



    // ...............Fetch a specific customer by ID
    // const customer = await getCustomerById(10);
    // if (customer) {
    //     console.log("Customer found:", customer);
    // } else {
    //     console.log("Customer not found");
    // }



    // .............Fetch a customer with reservations
    // const customerWithReservations = await getCustomerWithReservations(4);
    // if (customerWithReservations) {
    //     console.log("Customer with reservations found:", customerWithReservations);
    // } else {
    //     console.log("Customer with reservations not found");
    // }

    // .............Fetch a customer with bookings
    // const customerWithBookings = await getCustomerWithBookings(4);
    // if (customerWithBookings) {
    //     console.log("Customer with bookings found:", customerWithBookings);
    // } else {
    //     console.log("Customer with bookings not found");
    // }



    // .............Fetch a customer with selected details
    // const customerWithSelectedDetails = await getCustomerWithSelectedDetails(4);
    // if (customerWithSelectedDetails.length > 0) {
    //     console.log("Customer with selected details found:", customerWithSelectedDetails[0]);
    // } else {
    //     console.log("Customer with selected details not found");
    // }

    // .............Fetch locations with all cars available at that location
    // const locationsWithCars = await getLocationsWithCars();
    // if (locationsWithCars.length === 0) {
    //     console.log("No locations with cars found");
    //     return;
    // }
    // locationsWithCars.forEach(location => {
    //     console.log(`Location: ${location.locationName}`);
    //     location.cars.forEach(car => {
    //         console.log(`  - ${car.carModel}, ${car.color}, Rate: ${car.rentalRate}, Available: ${car.availability}`);
    //     });
    // });


    // .............Fetch cars with maintenance records
    // const carsWithMaintenance = await getCarsWithMaintenance();
    // if (carsWithMaintenance.length === 0) {
    //     console.log("No cars with maintenance records found");
    //     return;
    // }
    // carsWithMaintenance.forEach(car => {
    //     console.log(`Car Model: ${car.carModel}`);
    //     car.maintenanceRecords.forEach(record => {
    //         console.log(`  - Maintenance: ${record.description}, Date: ${record.maintenanceDate}`);
    //     });
    // });


    // .............Insert a new customer
    // const insertedCustomer = await insertCustomer(newCustomer);
    // if (insertedCustomer.length > 0) {
    //     console.log("New customer inserted successfully:", insertedCustomer[0]);
    // }
    // else {
    //     console.log("Failed to insert new customer");
    // }


    // .............Update a customer
    // const updatedCustomer = await updateCustomer("kemboi@gmail.com", {
    //     firstName: "Brian",
    //     lastName: "Kibet",
    //     phoneNumber: "0712345678",
    //     address: "10 Dekut Nyeri"
    // }
    // );
    // if (updatedCustomer.length > 0) {
    //     console.log("Customer updated successfully:", updatedCustomer[0]);
    // } else {
    //     console.log("Failed to update customer");
    // }


    // .............Delete a customer
    const deletedCustomer = await deleteCustomer(10);
    if (deletedCustomer.length > 0) {
        console.log("Customer deleted successfully:", deletedCustomer[0]);//deletedCustomer[0] means the first element in the array
    }
}
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1); // Exit with an error code
});
