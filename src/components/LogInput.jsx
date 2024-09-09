const LogInput = (props) => {
    return (
       <div>
             <input 
             className="form-control" id="name" type="text"
               name={props.name}
               {...props} />
               { props.isSubmitted &&  props.value === '' && 
               <span class="danger"> Username is required</span>
               }
           </div>
    );
   }
export default LogInput;