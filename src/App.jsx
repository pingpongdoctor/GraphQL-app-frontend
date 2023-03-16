import "./App.scss";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
function App() {
  //DEFINE THE QUERY FOR USERS
  const QUERY_USERS = gql`
    query GetAllUsers {
      users {
        id
        name
        height
        age
        friends {
          id
          name
          age
        }
        likedmovies {
          name
        }
      }
    }
  `;
  //USE USEQUERY TO FETCH USERS WHEN THE PAGE IS LOADED
  const { loading, error, data, refetch: getAllUsers } = useQuery(QUERY_USERS);

  //DEFINE THE QUERY FOR USER
  const QUERY_A_USER = gql`
    query GetSingleUser($id: ID!) {
      user(id: $id) {
        id
        name
        age
        height
        friends {
          name
        }
        likedmovies {
          name
        }
      }
    }
  `;

  //USE USELAZYQUERY TO GET THE FUNCTION TO QUERY A USER WHEN THE FUNCTION IS CALLED
  const [getSingleUser, { data: singleUserData, error: singleUserError }] =
    useLazyQuery(QUERY_A_USER);
  const [idInput, setIdInput] = useState(null);

  // DEFINE MUTATION FOR INSERTING A NEW USER
  const INSERT_USER = gql`
    mutation InsertNewUser($input: userInput!) {
      insertUser(input: $input) {
        id
        name
        age
        height
      }
    }
  `;

  //USE USEMUTATION TO GET THE FUNCTION TO INSERT USER
  const [insertUser, { data: insertedUser }] = useMutation(INSERT_USER);
  const [newUser, setNewUser] = useState({
    name: null,
    age: null,
    height: null,
  });

  //DEFINE MUTATION TO UPDATE USER
  const UPDATE_USER = gql`
    mutation UpdateUser($id: ID!, $input: userUpdateInput!) {
      updateUser(id: $id, input: $input) {
        id
        name
        age
        height
      }
    }
  `;

  //USE USEMUTATION TO GET THE FUNCTION TO UPDATE THE USER
  const [updateUser, ...rest] = useMutation(UPDATE_USER);
  const [updatedId, setUpdatedId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updatedHeight, setUpdatedHeight] = useState("");

  //DEFINE THE MUTATION TO DELETE
  const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id) {
        id
        name
      }
    }
  `;

  //USE USEMUTATION TO GET THE FUNCTION USED TO DELETE THE USER
  const [deleteUser, { data: deletedUser }] = useMutation(DELETE_USER);
  const [deletedId, setDeletedId] = useState("");
  return (
    <div className="App">
      {/* SHOW ALL USERS */}
      {data &&
        data.users &&
        data.users.map((user) => (
          <div key={user.id}>
            <p>id: {user.id}</p>
            <p>Username: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Height: {user.height}</p>
          </div>
        ))}
      {/* EXAMPLE FOR THE APPLICATION OF USELAZYQUERY */}
      <input
        onChange={(event) => {
          setIdInput(event.target.value);
        }}
        type="text"
        placeholder="input your id"
      />
      <button
        onClick={() => {
          if (idInput) {
            getSingleUser({
              variables: { id: idInput },
            });
          } else {
            alert("Please insert a valid ID");
          }
        }}
      >
        Search User Based On Id
      </button>
      {singleUserData && singleUserData.user && (
        <p>Username: {singleUserData.user.name}</p>
      )}
      {singleUserError && <p>Error</p>}

      {/* INSERT NEW USER */}
      <div>
        <input
          onChange={(event) => {
            setNewUser({ ...newUser, name: event.target.value });
          }}
          type="text"
          placeholder="name"
        />
        <input
          onChange={(event) => {
            setNewUser({ ...newUser, age: Number(event.target.value) });
          }}
          type="number"
          placeholder="age"
          onWheel={(e) => {
            e.target.blur();
          }}
        />
        <input
          onChange={(event) => {
            setNewUser({ ...newUser, height: Number(event.target.value) });
          }}
          type="number"
          placeholder="height"
          onWheel={(e) => {
            e.target.blur();
          }}
        />
        <button
          onClick={() => {
            if (newUser.name && newUser.age && newUser.height) {
              insertUser({
                variables: {
                  input: newUser,
                },
              });
              //USE REFETCH FUNCTION TO TRIGGER THE QUERY FOR ALL USERS AFTER INSERTING A NEW ONE
              getAllUsers();
            } else {
              alert("Please insert valid data");
            }
          }}
        >
          Insert new user
        </button>
      </div>
      {/* UPDATE USER */}
      <div>
        <input
          onChange={(event) => {
            setUpdatedId(Number(event.target.value));
          }}
          type="number"
          placeholder="update user id"
          onWheel={(e) => {
            e.target.blur();
          }}
        />
        <input
          onChange={(event) => {
            setUpdatedName(event.target.value);
          }}
          type="text"
          placeholder="update name"
        />
        <input
          onChange={(event) => {
            setUpdatedAge(Number(event.target.value));
          }}
          type="number"
          placeholder="update age"
        />
        <input
          onChange={(event) => {
            setUpdatedHeight(Number(event.target.value));
          }}
          type="number"
          placeholder="update height"
        />

        <button
          onClick={() => {
            const idArr = data.users.map((user) => Number(user.id));
            if (
              updatedId &&
              idArr.includes(updatedId) &&
              (updatedName || updatedAge || updatedHeight)
            ) {
              const currentUser = data.users.find(
                (user) => Number(user.id) === updatedId
              );
              const updatedObj = {
                name: updatedName ? updatedName : currentUser.name,
                age: updatedAge ? updatedAge : currentUser.age,
                height: updatedHeight ? updatedHeight : currentUser.height,
              };
              updateUser({
                variables: {
                  id: updatedId,
                  input: updatedObj,
                },
              });
              getAllUsers();
            } else {
              alert("Please insert valid values");
            }
          }}
        >
          Update the user
        </button>
      </div>
      {/* DELETE A USER */}
      <div>
        <input
          onChange={(event) => {
            setDeletedId(Number(event.target.value));
          }}
          type="number"
          placeholder="id of user to delete"
          onWheel={(e) => {
            e.target.blur();
          }}
        />
        <button
          onClick={() => {
            const idArr = data.users.map((user) => Number(user.id));
            if (deletedId && idArr.includes(deletedId)) {
              deleteUser({
                variables: {
                  id: deletedId,
                },
              });
              getAllUsers();
            } else {
              alert("Please input the id");
            }
          }}
        >
          Delete the user
        </button>
      </div>
    </div>
  );
}

export default App;
