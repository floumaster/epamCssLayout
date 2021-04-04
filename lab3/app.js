const {randomUserMock , additionalUsers} = require("./../src/js/mock_for_L3.js");
const codes = require("./codes.js");



function normalize(randomUserMock, additionalUsers){
    let normalized_array = randomUserMock.map((current, index, array)=>{
        return {
            gender: current.gender,
            title: current.name.title,
            full_name: current.name.first + ' ' + current.name.last,
            city: current.location.city,
            state: current.location.state,
            country: current.location.country,
            postcode: current.location.postcode,
            coordinates: current.location.coordinates,
            timezone: current.location.timezone,
            email: current.email,
            b_date: current.dob.date,
            age: current.dob.age,
            phone: current.phone,
            picture_large: current.picture.large,
            picture_thumbnail: current.picture.thumbnail,
            id: index,
            favorite: false,
            course: 'maths',
            bg_color: "#1f75cb",
            note: 'unknown teacher',
        }
    })
    normalized_array.push(...additionalUsers);
    const withoutDuplicates = [];
    for(let i of normalized_array){
        if(!withoutDuplicates.find((el)=> i.full_name === el.full_name)){
            withoutDuplicates.push(i);
        }
    }
    return withoutDuplicates;
}

function validate(array){
    let result = '';
    for(let i of array){
        Object.keys(i).forEach((curr)=>{
            switch(curr){
                case 'gender' || 'full_name' || 'note' || 'state' || 'city' || 'country':
                    if(typeof i[curr] !== 'string'){
                        result+=`Error in object with full_name ${i.full_name}.\nValue type of field ${curr} is ${typeof i[curr]} (string is required)\n\n`;
                    }
                    else if(i[curr][0].toUpperCase() !== i[curr][0]){
                        result+=`Error in object with full_name ${i.full_name}.\nValue of field ${curr} doesn't start with upper case\n\n`;
                    }
                    break;
                case 'age':
                    if(typeof i[curr] !== 'number'){
                        result+=`Error in object with full_name ${i.full_name}.\nValue type of field ${curr} is ${typeof i[curr]} (number is required)\n\n`;
                    }
                    break;
                case 'phone':
                    const number = i[curr].split('').filter(val=>!isNaN(val)&&val!==' ').join('')
                    const code = number.slice(0,3);
                    for(let y of codes.country){
                        if(y.eng===i.country){
                            const true_code = y.code.slice(1);
                            if(code !== true_code){
                                result+=`Error in object with full_name ${i.full_name}.\nIn ${i.country} code of phone number ${number} have to be ${true_code} but not ${code}\n\n`; 
                            }
                            if(number.length!==parseInt(y.length)){
                                result+=`Error in object with full_name ${i.full_name}.\nIn ${i.country} phone number ${number} have to be ${y.length} in length but not ${number.length}\n\n`;
                            }
                            break;
                        }
                    }
                    break;
                case 'email':
                    if(i[curr].indexOf('@') === -1 || i[curr].indexOf('@') === 0){
                        result+=`Error in object with full_name ${i.full_name}.\nEmail doesn't have a symbol '@'\n\n`;
                    }
                    break;
                default:
                    break;
            }
        })
    }
    return result;
}


function filter(array, params){
    for(let key in params){
        if(key==='name'){
            array = array.filter(curr=>curr['full_name'].slice(0,curr['full_name'].indexOf(' '))===params[key])
        }
        else{
            array = array.filter(curr=>curr[key]===params[key])
        }
    }
    return array;
}

function sort(array, order){
    const obj = {};
    for(let i of Array.from(arguments).slice(2)){
        const kek = `sorted-by-${i}`;
        obj[kek] = array.sort((a,b)=>{
            if(order==='decrease'){
                if (a[i]>b[i]) {
                    return -1;
                }
                else if (a[i]<b[i]) {
                    return 1;
                }
            }
            else{
                if (a[i]<b[i]) {
                    return -1;
                }
                else if (a[i]>b[i]) {
                    return 1;
                }
            }
            return 0;
        })
    }
    return obj;
}

function search(array, params){
    return filter(array, params)[0];
}

function persent(array, params){
    return (filter(array, params).length * 100 / array.length)
}

const arr = normalize(randomUserMock, additionalUsers);
//console.log(arr);
const error_str = validate(arr);
//console.log(error_str);
const arr2 = filter(arr, {country: 'Germany'});
//console.log(arr2);
const arr3 = sort(arr, 'increase', 'age');
//console.log(arr3);
const obj = search(arr, {name: 'Norbert'});
//console.log(obj);
const pers = persent(arr, {name: 'Norbert'});
//console.log(pers)