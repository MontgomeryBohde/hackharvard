import fetch from 'node-fetch';

export async function fetchNavSats(lat, lgt){
    const url = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/50&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    data.above.sort((a, b) => {
        return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
    });

    // return the first 5 satellites
    return data.above.slice(0, 5);
}

export async function fetchImgSats(lat, lgt){
    const url = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/48&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const res = [];

    // for the the image category, we want 2 satellites, the issue is that there are not that many of them, so we 
    // may need to query multiple different endpoints to look for 2
    // we will add these to res until we have two and then we will return res


    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null
    if (!(data === null)){
        data.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data.above.length; i++){
            res.push(data.above[i]);
        }
    }
    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    // if we have less than 2, we need to query next endpoint
    const url2 = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/8&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';

    const response2 = await fetch(url2);
    if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
    }
    const data2 = await response2.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null

    if (!(data2 === null)){
        data2.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data2.above.length; i++){
            res.push(data2.above[i]);
        }
    }

    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    // if we have less than 2, we need to query next endpoint

    const url3 = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/7&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';

    const response3 = await fetch(url3);
    if (!response3.ok) {
        throw new Error(`HTTP error! status: ${response3.status}`);
    }

    const data3 = await response3.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null

    if (!(data3 === null)){
        data3.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data3.above.length; i++){
            res.push(data3.above[i]);
        }
    }
    
    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    // if we have less than 2, we need to query next endpoint

    const url4 = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/6&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';

    const response4 = await fetch(url4);
    if (!response4.ok) {
        throw new Error(`HTTP error! status: ${response4.status}`);
    }

    const data4 = await response4.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null

    if (!(data4 === null)){
        data4.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data4.above.length; i++){
            res.push(data4.above[i]);
        }
    }

    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    return res;
}

export async function fetchComSats(lat, lgt){
    const url = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/52&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    data.above.sort((a, b) => {
        return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
    });

    // return the first 6 satellites
    return data.above.slice(0, 7);
}

export async function fetchWeatherSats(lat, lgt){
    const url = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/5&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const res = [];

    // for the the image category, we want 2 satellites, the issue is that there are not that many of them, so we 
    // may need to query multiple different endpoints to look for 2
    // we will add these to res until we have two and then we will return res


    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null
    if (!(data === null)){
        data.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data.above.length; i++){
            res.push(data.above[i]);
        }
    }
    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    // if we have less than 2, we need to query next endpoint
    const url2 = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/4&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';

    const response2 = await fetch(url2);
    if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
    }
    const data2 = await response2.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null

    if (!(data2 === null)){
        data2.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data2.above.length; i++){
            res.push(data2.above[i]);
        }
    }

    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    // if we have less than 2, we need to query next endpoint

    const url3 = 'https://api.n2yo.com/rest/v1/satellite/above/' + lat + '/' + lgt + '/0/90/3&apiKey=57YL9A-FF4FYG-HPLKZ9-5550/';

    const response3 = await fetch(url3);
    if (!response3.ok) {
        throw new Error(`HTTP error! status: ${response3.status}`);
    }

    const data3 = await response3.json();

    // sort data by by the ecludian distance from the observer (lat, lgt)
    // first check that data is non-null

    if (!(data3 === null)){
        data3.above.sort((a, b) => {
            return Math.sqrt(Math.pow((a.satlat - lat), 2) + Math.pow((a.satlng - lgt), 2)) - Math.sqrt(Math.pow((b.satlat - lat), 2) + Math.pow((b.satlng - lgt), 2));
        });
        // add the satellite(s) to res
        for (let i = 0; i < data3.above.length; i++){
            res.push(data3.above[i]);
        }
    }
    
    // if we have 2 or more, return
    if (res.length >= 2){
        return res.slice(0, 2);
    }

    return res;
}