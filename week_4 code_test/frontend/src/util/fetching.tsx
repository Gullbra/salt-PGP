
export default async function fetching () {
  const optionObj = { 
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  fetch('./mock/mock.data.json', optionObj)
    .then(response => response.json())
}
