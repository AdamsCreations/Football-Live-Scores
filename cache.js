const cache = new Map();
const date = new Date;

export function getCache(key){
    const obj = cache.get(key);

    console.log("check if cache is null");
    if(!obj){
        console.log("cache is null")
        return(null);
    };

    const isExpired = Date.now() - obj.dateCreated > 60000;

    console.log("dateCreated:", obj.dateCreated);
    console.log("ttl:", obj.ttl);
    console.log("time passed:", Date.now() - obj.dateCreated);
    console.log("isExpired:", Date.now() - obj.dateCreated > 60000);

    console.log("check if cache is expired")
    if(isExpired){
        console.log("cache is expired")
        cache.delete(key);
        return(null);
    };

    console.log("return cache")
    return(cache.get(key));
};

export function setCache(key, data, dateCreated){
    cache.set(key,{data, dateCreated});
    console.log("set cache");
};