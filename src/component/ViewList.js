import React, { useEffect ,useState} from 'react'
import axios from "axios";
import List from '../component/List.css'




function ViewList(){


const [data,setData]=useState([]);
const [search,setSearch]=useState([]);
const [checked,setChecked]=useState(false);
const [dataPerPages,setDataPerPages]=useState(10);
const [current,setCurrent]=useState(1);
const [show,setShow]=useState(false);
const [name,setName]=useState(data.name);
const [email,setEmail]=useState(data.email);
const [role,setRole]=useState(data.role);


const numOfPages =Math.ceil(data.length/dataPerPages)
const pages=[...Array(numOfPages+1).keys()].slice(1)
const lastIndex=current*dataPerPages
const firstIndex=lastIndex-dataPerPages
const visible=data.slice(firstIndex,lastIndex)



const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  
useEffect(()=>{loadUserData()},[])

function Save(id){
  search.name=name; 
  search.email=email;
  search.role=role;
}
const loadUserData= async ()=>{
return await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
.then((res)=>
{
setData(res.data)
setSearch(res.data)
}).catch((err)=>console.log(err))


}  
const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    console.log(newData.id)
};

//to filter data
  const Filter = (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filteredData = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.role.toLowerCase().includes(keyword)
      );
    });
    setSearch(filteredData);
    setCurrent(1);
  };
  
function prevPage(){
  if(current!==firstIndex)setCurrent(current-1)
}
//_______________________________________________________
 //checkbox click
const  handleChange=(e)=>{
const {name,checked}=e.target
if(name==="allselect"){const checkedvalue=search.map((user)=>{return {...user,isChecked:checked}})
console.log(checkedvalue)
setSearch(checkedvalue)
}
else{const checkedvalue=search.map((user)=>user.name===name?{...user,isChecked:checked}:user)

console.log(checkedvalue)
setSearch(checkedvalue)}

}
//delete via button click
function handleRemove(id) {
  const newList = search.filter((item) => item.id !== id);
  
  setSearch(newList);

}

function deleteSelected(){
  const list=search.filter((item)=>item.isChecked==true)
  console.log(list)
  setSearch(list)
}
 //html form starts here!!!!!!!!!!
  return (
    <>
    <input   type="text"  onChange={Filter} placeholder='Search by name ,email or role' className='search tbl' />
     
     
        <table className='tbl'>
  <tr className='head'>
    
    <th><span><input
        type="checkbox"
name='allselect' checked={!search.slice(firstIndex,lastIndex).some((user)=>user?.isChecked!==true)} onChange={handleChange}/></span>Select</th>
    <th>Name</th>
    <th>Email </th> 
    <th>Role</th>
    <th>Action</th>
  </tr>
  {search.slice(firstIndex,lastIndex).map((item,index)=> (
       <tr key={index}>
      <input type="checkbox" name={ item.name} checked={item?.isChecked|| false }  htmlFor={item.name} style={{ backgroundColor: item.isChecked ? "yellow" : "transparent" }} onChange={ handleChange }  />
       <td>{item.name}</td>
       <td>{item.email}</td>
       <td>{item.role}</td>
       <td>
        <td><button className='danger' onClick={() => handleRemove(item.id)}>Delete</button></td>
        <td><button className='edit' onClick={() => setShow(!show)}>Edit</button></td>
       </td>
     </tr>
      ))}
 
</table>
  
    <div className='pagination'> 
    <div><button className='danger' onClick={deleteSelected} >Delete Selected</button></div>
    <div>
    <button className='edit'   onClick={prevPage}>Prev</button>
    {pages.map((pages)=><button className='edit' onClick={()=>setCurrent(pages)}>{pages}</button>)}
    <button className='edit' onClick={() => setCurrent(current + 1)}>Next</button>
     </div>
    </div>
    <div className={!show ? "editScreen" : "editScreen-vis"}> 
    <form>
    <input type='text' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}></input>
    <input type='text' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
    <select value={role} onChange={(e)=>setRole(e.target.value)}>
      <option>admin</option>
      <option>member</option>
    </select>

   
    </form>
    <button className='edit' onClick={Save} >Save</button>
   
   
   
   
   </div>
        </>
  );
};


   


export default ViewList



