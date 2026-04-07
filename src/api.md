{
"info": {
"_postman_id": "89e7c256-d5c8-49c6-bd38-91647660997d",
"name": "Nature Application",
"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
"\_exporter_id": "51820129",
"\_collection_link": "https://go.postman.co/collection/47081626-89e7c256-d5c8-49c6-bd38-91647660997d?source=collection_link"
},
"item": [
{
"name": "Country",
"item": [
{
"name": "addCountry",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Egypt",
"type": "text",
"uuid": "d2e562d0-af6a-4639-98a8-47d19e5d5691"
},
{
"key": "logo",
"type": "file",
"uuid": "aa5d3c1c-c267-4e27-a472-0f307c49ba41",
"src": "/C:/Users/Xpress/OneDrive/Pictures/Egyptian-Flag-Egypt-Tours-Portal.jpg"
},
{
"key": "locale",
"value": "en",
"type": "text",
"uuid": "8385deac-0080-47eb-92e2-3da31525f4a2"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/countries/add",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries",
"add"
]
}
},
"response": []
},
{
"name": "getSpecificCountry",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "getAllCountries",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/countries",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries"
]
}
},
"response": []
},
{
"name": "updateCountry",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "مصر",
"type": "text",
"uuid": "a4e3fb16-3754-4a0c-9309-1d395e82e9e7"
},
{
"key": "logo",
"type": "file",
"uuid": "220692db-45a0-4557-b26d-f8239bcbbba1",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80_.jpg",
"disabled": true
},
{
"key": "locale",
"value": "ar",
"type": "text",
"uuid": "9374c89d-cf05-48ce-b834-8f00d96f7845"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/countries/da690ce7-d5de-4bf9-9330-a9028be9ed7e",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries",
"da690ce7-d5de-4bf9-9330-a9028be9ed7e"
]
}
},
"response": []
},
{
"name": "deleteCountry",
"request": {
"method": "DELETE",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "مصر",
"type": "text",
"uuid": "a4e3fb16-3754-4a0c-9309-1d395e82e9e7"
},
{
"key": "logo",
"type": "file",
"uuid": "220692db-45a0-4557-b26d-f8239bcbbba1",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL._AC_UF1000,1000_QL80_.jpg",
"disabled": true
},
{
"key": "locale",
"value": "ar",
"type": "text",
"uuid": "9374c89d-cf05-48ce-b834-8f00d96f7845"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/countries/da690ce7-d5de-4bf9-9330-a9028be9ed7e",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries",
"da690ce7-d5de-4bf9-9330-a9028be9ed7e"
]
}
},
"response": []
},
{
"name": "getCountryWithCitiesOnly",
"request": {
"method": "GET",
"header": []
},
"response": []
}
]
},
{
"name": "City",
"item": [
{
"name": "addCity",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"name\":\"Alex\",\r\n \"country*id\":\"e28beb2a-d554-4dc0-8fef-c7bafbe01e50\"\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/cities",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities"
]
}
},
"response": []
},
{
"name": "getCitiesByCountry",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"name\":\"Alex\",\r\n \"country_id\":\"e28beb2a-d554-4dc0-8fef-c7bafbe01e50\"\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/cities/country/e1c9f73c-d5a7-4242-a93f-a41ab5c77e03",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities",
"country",
"e1c9f73c-d5a7-4242-a93f-a41ab5c77e03"
]
}
},
"response": []
},
{
"name": "getSpecificCity",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"name\":\"Alex\",\r\n \"country_id\":\"e28beb2a-d554-4dc0-8fef-c7bafbe01e50\"\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/cities/0c93ca80-b8cb-4909-9bfc-7cedbb7fb06d",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities",
"0c93ca80-b8cb-4909-9bfc-7cedbb7fb06d"
]
}
},
"response": []
},
{
"name": "updateCity",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"name\":\"القاهرة\",\r\n \"locale\":\"ar\"\r\n \r\n \r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/cities/7527d4a4-1bb0-48e9-84a9-d98bfec90968",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities",
"7527d4a4-1bb0-48e9-84a9-d98bfec90968"
]
}
},
"response": []
},
{
"name": "deleteCity",
"request": {
"method": "GET",
"header": []
},
"response": []
}
]
},
{
"name": "Award Dashboard",
"item": [
{
"name": "addAward",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 113|ATBNJNG5fRUGDl5DovXTUIjrDH4CopzRhA4xbakc5915f129",
"type": "text"
},
{
"key": "locale",
"value": "en",
"type": "text"
},
{
"key": "message-locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Ahmd khaled And Others Award",
"type": "text",
"uuid": "9eebff78-8f59-4b72-a31a-0dca1a65e027"
},
{
"key": "description",
"value": "this is Ahmed Khaled And Others award",
"type": "text",
"uuid": "44b436bb-a97b-410f-a372-b16be553efe8"
},
{
"key": "image",
"type": "file",
"uuid": "024af0fd-10b3-4c59-8469-339e17543c5e",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "award*date",
"value": "02/12/2019",
"type": "text",
"uuid": "5284ec64-6f6a-447f-a9a6-eccf3c7d5720"
},
{
"key": "organizations_logos[0]",
"type": "file",
"uuid": "ea590a1d-507b-4027-9ea7-644a6f5de3b0",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "organizations_logos[1]",
"type": "file",
"uuid": "6566516a-856e-43d4-b737-e8a3d60c9a7a",
"src": "/C:/Users/Xpress/OneDrive/Pictures/1-43lg-CTy-M5c-TTABj-C2-VEHd-A.webp"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/awards",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards"
]
}
},
"response": []
},
{
"name": "updateAward",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "title",
"value": "Arab Awards2",
"type": "text",
"uuid": "9eebff78-8f59-4b72-a31a-0dca1a65e027"
},
{
"key": "description",
"value": "this is arab award",
"type": "text",
"uuid": "44b436bb-a97b-410f-a372-b16be553efe8",
"disabled": true
},
{
"key": "image",
"type": "file",
"uuid": "024af0fd-10b3-4c59-8469-339e17543c5e",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg",
"disabled": true
},
{
"key": "organization_name",
"value": "Korya Organization",
"type": "text",
"uuid": "133cd1aa-3d47-4bd6-8f3e-296ef4b48e07",
"disabled": true
},
{
"key": "organization_logo",
"type": "file",
"uuid": "ed46f4e1-5146-4365-a46b-c658af85658f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/nature-icon-symbol-restore-nature-simple-creative-logo-design-elegant-nature-logo-design-nature-simple-logo-vector.jpg",
"disabled": true
},
{
"key": "url",
"value": "https://google.com",
"type": "text",
"uuid": "176c0bf7-d8a5-4f8e-8f85-65bdc118e504",
"disabled": true
},
{
"key": "content_file",
"type": "file",
"uuid": "15c80604-f62a-4ea9-ab9a-d1780b912e56",
"src": "/C:/Users/Xpress/OneDrive/Pictures/GetResourceFile (11).pdf",
"disabled": true
},
{
"key": "locale",
"value": "ar",
"type": "text",
"uuid": "f0d9652d-96ff-4da4-9bd4-f77b4e594f72",
"disabled": true
}
]
},
"url": {
"raw": "{{baseUrl}}/api/awards/e0f4b86b-ebd5-4a2b-ab4c-15332430fcd9",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"e0f4b86b-ebd5-4a2b-ab4c-15332430fcd9"
]
}
},
"response": []
},
{
"name": "getAllAwards",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "en",
"type": "text",
"disabled": true
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "title",
"value": "Arab Award",
"type": "text",
"uuid": "9eebff78-8f59-4b72-a31a-0dca1a65e027"
},
{
"key": "description",
"value": "this is arab award",
"type": "text",
"uuid": "44b436bb-a97b-410f-a372-b16be553efe8"
},
{
"key": "image",
"type": "file",
"uuid": "024af0fd-10b3-4c59-8469-339e17543c5e",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "organization_name",
"value": "Korya Organization",
"type": "text",
"uuid": "133cd1aa-3d47-4bd6-8f3e-296ef4b48e07"
},
{
"key": "organization_logo",
"type": "file",
"uuid": "ed46f4e1-5146-4365-a46b-c658af85658f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/nature-icon-symbol-restore-nature-simple-creative-logo-design-elegant-nature-logo-design-nature-simple-logo-vector.jpg"
},
{
"key": "url",
"value": "https://google.com",
"type": "text",
"uuid": "176c0bf7-d8a5-4f8e-8f85-65bdc118e504"
},
{
"key": "content_file",
"type": "file",
"uuid": "15c80604-f62a-4ea9-ab9a-d1780b912e56",
"src": "/C:/Users/Xpress/OneDrive/Pictures/GetResourceFile (11).pdf"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/awards?page=1&size=5&key=name&value=as",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards"
],
"query": [
{
"key": "page",
"value": "1"
},
{
"key": "size",
"value": "5"
},
{
"key": "key",
"value": "name",
"type": "text"
},
{
"key": "value",
"value": "as",
"type": "text"
}
]
}
},
"response": []
},
{
"name": "deleteAward",
"request": {
"method": "DELETE",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "title",
"value": "Arab Award",
"type": "text",
"uuid": "9eebff78-8f59-4b72-a31a-0dca1a65e027"
},
{
"key": "description",
"value": "this is arab award",
"type": "text",
"uuid": "44b436bb-a97b-410f-a372-b16be553efe8"
},
{
"key": "image",
"type": "file",
"uuid": "024af0fd-10b3-4c59-8469-339e17543c5e",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "organization_name",
"value": "Korya Organization",
"type": "text",
"uuid": "133cd1aa-3d47-4bd6-8f3e-296ef4b48e07"
},
{
"key": "organization_logo",
"type": "file",
"uuid": "ed46f4e1-5146-4365-a46b-c658af85658f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/nature-icon-symbol-restore-nature-simple-creative-logo-design-elegant-nature-logo-design-nature-simple-logo-vector.jpg"
},
{
"key": "url",
"value": "https://google.com",
"type": "text",
"uuid": "176c0bf7-d8a5-4f8e-8f85-65bdc118e504"
},
{
"key": "content_file",
"type": "file",
"uuid": "15c80604-f62a-4ea9-ab9a-d1780b912e56",
"src": "/C:/Users/Xpress/OneDrive/Pictures/GetResourceFile (11).pdf"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/awards/25d2c5dc-8bce-4135-b1f9-468760d17792",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"25d2c5dc-8bce-4135-b1f9-468760d17792"
]
}
},
"response": []
},
{
"name": "getSpecificAward",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/awards/98e9d1c8-53ee-4626-a9af-876dd601a39e",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"98e9d1c8-53ee-4626-a9af-876dd601a39e"
]
}
},
"response": []
},
{
"name": "BulkDeleteAwards",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\r\n\r\n \"174ea9f2-0929-4127-bfc1-55c27455e0e6\",\r\n \"2d54461d-e82f-4484-a37e-aa47f83a94b3\"\r\n ]\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/awards/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "Export Awards",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text",
"disabled": true
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": ""
},
"url": {
"raw": "{{baseUrl}}/api/awards/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"actions",
"export"
]
}
},
"response": []
}
]
},
{
"name": "Service Dashboard",
"item": [
{
"name": "addService",
"request": {
"method": "POST",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text",
"disabled": true
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": ""
},
"url": {
"raw": "{{baseUrl}}/api/services",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services"
]
}
},
"response": []
},
{
"name": "updateService",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "{\r\n//\"deleteFromAllLocales\": true, \r\n\r\n\"values\":[\r\n\r\n{ \"id\": \"d7e4c1b0-c66e-4a3a-a245-59a0d474359f\",\"title\": \"value1\",\"description\": \"this is value 1\"},\r\n\r\n{\"id\": \"b47160de-3151-49d6-bfef-b3ea723fae24\",\"title\": \"value2\",\"description\": \"this is value 2\"},\r\n\r\n\r\n\r\n\r\n{\"title\": \"value4\",\"descripttion\": \"this is value 4\"}\r\n\r\n\r\n]\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/services/1af4ac5c-83ff-4ead-b618-ac48a4ef6f26",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"1af4ac5c-83ff-4ead-b618-ac48a4ef6f26"
]
}
},
"response": []
},
{
"name": "getSpecificService",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/services/ac0d3315-c028-40af-8e4f-f8478f54a24a",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"ac0d3315-c028-40af-8e4f-f8478f54a24a"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "deleteService",
"request": {
"method": "DELETE",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/services/a81ab621-e706-42ff-86c3-ca7a672a1070",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"a81ab621-e706-42ff-86c3-ca7a672a1070"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "getAllServicesNames",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "getSearchServices",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Simplex",
"type": "text",
"uuid": "f82a12ba-b2a4-45e8-8e17-ee33e7b46931"
},
{
"key": "brief",
"value": "this is simplex",
"type": "text",
"uuid": "5b1b797d-b8ca-41ad-9a29-49a9b2271f27"
},
{
"key": "overview",
"value": "yes this is simplex",
"type": "text",
"uuid": "aa5e7868-97a8-4d23-a386-9e814172a6b1"
},
{
"key": "result",
"value": "result well",
"type": "text",
"uuid": "a1be8077-7a24-480a-a3ae-7c7a485b155f"
},
{
"key": "project reflected",
"value": "reflected well",
"type": "text",
"uuid": "224a9e34-ed19-4dbc-9ac1-fde81dd74a50"
},
{
"key": "start_date",
"value": "1 Dec 2024",
"type": "text",
"uuid": "de11692d-ffe6-4ef9-a0ca-ca79795047e9"
},
{
"key": "end_date",
"value": "2 Feb 2025",
"type": "text",
"uuid": "6421e84d-4ee7-4080-b555-57ada10e36a0"
},
{
"key": "image_before",
"type": "file",
"uuid": "8a52c201-f60e-446c-8ac3-d04f1a5b9215",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images (1).jpeg"
},
{
"key": "image_after",
"type": "file",
"uuid": "cda270d5-a841-47cb-bd65-1fa826a3a44d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/intersteller.png"
},
{
"key": "gallery[0]",
"type": "file",
"uuid": "d7e1ac1d-5903-4c49-ad60-7a2c32f7221d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/furnture-image.jpeg"
},
{
"key": "gallery[1]",
"type": "file",
"uuid": "93c2f982-491e-4d34-b660-bb9c743eca1f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images.png"
},
{
"key": "city_id",
"value": "7527d4a4-1bb0-48e9-84a9-d98bfec90968",
"type": "text",
"uuid": "20e6ac26-3978-4155-b438-8ddaf0dc06fb"
},
{
"key": "country_id",
"value": "e28beb2a-d554-4dc0-8fef-c7bafbe01e50",
"type": "text",
"uuid": "dd3300e3-5440-4b2e-9671-3be93fba92c0"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/services?size=5&page=1&key=name&value=sad",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
},
{
"key": "size",
"value": "5",
"type": "text"
},
{
"key": "page",
"value": "1",
"type": "text"
},
{
"key": "key",
"value": "name",
"type": "text"
},
{
"key": "value",
"value": "sad",
"type": "text"
}
]
}
},
"response": []
},
{
"name": "BulkDeleteServices",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\r\n\r\n \"5438da83-6b88-4c12-8e35-504be134a041\",\r\n \"5bdef370-3b28-4449-88b4-76f17233d3a3\"\r\n \r\n\r\n ]\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/services/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "Export Services",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "we service",
"type": "text",
"uuid": "e5ee8006-68e4-4076-82db-d5cd1ef6b01c"
},
{
"key": "tagline",
"value": "this is we service",
"type": "text",
"uuid": "18144c3d-a5e2-453b-96fa-0c8aa7254f0d"
},
{
"key": "steps[0][title]",
"value": "step1",
"type": "text",
"uuid": "9a8445b4-1e0e-4fde-94d9-967a2d0a74d8"
},
{
"key": "steps[0][description]",
"value": "this is step1",
"type": "text",
"uuid": "702e9efd-80f7-4f1a-a1fb-55e48c7a1f5d"
},
{
"key": "steps[0][image]",
"type": "file",
"uuid": "1ba1b07a-677a-4201-83f4-425c76db9c8b",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "values[0][tools][0]",
"value": "analysis",
"type": "text",
"uuid": "4a582e6a-6c2c-497e-8d98-1b0089609be9"
},
{
"key": "values[0][tools][1]",
"value": "consistency",
"type": "text",
"uuid": "215d686e-09ef-4690-9ed0-c7d6d1206a64"
},
{
"key": "values[0][title]",
"value": "value 1",
"type": "text",
"uuid": "7d02baba-f5a1-4464-b842-57468a6c9c8b"
},
{
"key": "values[0][description]",
"value": "this is value 1",
"type": "text",
"uuid": "dd075550-fdca-44a8-970d-96941cdd9064"
},
{
"key": "benefitTitle",
"value": "vvv",
"type": "text",
"uuid": "fb809e05-ab7c-4132-bb32-c3de012da20c"
},
{
"key": "benefitTagline",
"value": "fff",
"type": "text",
"uuid": "670dcd8b-b3fd-4be7-99d2-144449b44b4f"
},
{
"key": "benefitBody",
"value": "hhh",
"type": "text",
"uuid": "7c833c6b-8214-4e53-b6fc-98861ef2faf6"
},
{
"key": "benefitInsights[0][metric_title]",
"value": "metric1",
"type": "text",
"uuid": "c0b5a115-054d-420e-82e2-d1b8e0a830ad"
},
{
"key": "benefitInsights[0][metric_number]",
"value": "2222",
"type": "text",
"uuid": "ce564426-cc1f-4422-9f1c-41e6d2553915"
},
{
"key": "impacts[0][title]",
"value": "impact1",
"type": "text",
"uuid": "d5d265fc-c764-48c5-b431-e26aad4749ff"
},
{
"key": "impacts[0][description]",
"value": "this is impact1",
"type": "text",
"uuid": "c842e07d-b278-4a8e-b716-879034a1178d"
},
{
"key": "impacts[0][image]",
"type": "file",
"uuid": "5895073b-e55d-4ba3-bffa-fece88db00f8",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL._AC_UF1000,1000_QL80_.jpg"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/services/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"actions",
"export"
]
}
},
"response": []
}
]
},
{
"name": "User",
"item": [
{
"name": "registerUser",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n\r\n \"username\":\"AhmedKhaled\",\r\n \"email\":\"ahmedkorya1111@gmail.com\",\r\n \"password\":\"Ahmed@123\",\r\n \"password*confirmation\":\"Ahmed@123\"\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/users/register",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"users",
"register"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "authenticateUser",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"username\":\"Admin\",\r\n \"password\":\"Admin@123\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/users/signin",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"users",
"signin"
]
}
},
"response": []
},
{
"name": "logoutOneDevice",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 3|WNXemU4jBj4OtLKXBENhMvOG5J7rtoWOOBZiJJ5P9fce9a16",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/users/logout",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"users",
"logout"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "logoutAllDevices",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 4|BdrnXnHIWEe0wal7M0hkddpNLLTMBiQwVpDHMiCI347336e9",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/users/logoutAll",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"users",
"logoutAll"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
}
]
},
{
"name": "Client Dashboard",
"item": [
{
"name": "addClient",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 22|fBdV62giXa4zaMLK6ghsXrsPXysJ9t4derU0YiY675822760",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name_en",
"value": "Ahmed",
"type": "text",
"uuid": "1641b3a5-5752-4062-9462-80ad23ff8532"
},
{
"key": "name_ar",
"value": "",
"type": "text",
"uuid": "aed7dc38-aaf0-40c1-b3e2-ce3802397744"
},
{
"key": "image",
"type": "file",
"uuid": "c5d6924f-a883-4ae7-81fa-8b561962a498",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg",
"disabled": true
}
]
},
"url": {
"raw": "{{baseUrl}}/api/clients",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients"
]
}
},
"response": []
},
{
"name": "updateClient",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 18|5ONMtouOJ49friCe1iVZ8pEYfd8vKVK3qBxa10Yx8bf2b2fe",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "image",
"type": "file",
"uuid": "5a0661d4-86f3-48a4-af4b-e422fbd8213c",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/clients/0d5b4877-73d8-4ced-adcf-f73c104a9895",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients",
"0d5b4877-73d8-4ced-adcf-f73c104a9895"
]
}
},
"response": []
},
{
"name": "getAllClients",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/clients",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients"
]
}
},
"response": []
},
{
"name": "deleteClient",
"request": {
"method": "DELETE",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/clients/36ca8d93-ee3b-4584-85ad-a98285c8a540",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients",
"36ca8d93-ee3b-4584-85ad-a98285c8a540"
]
}
},
"response": []
},
{
"name": "getSpecificClient",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "BulkDeleteClients",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\r\n\r\n \"cef66e8a-aafa-418f-afbb-af708614436f\",\r\n \"f5b774e6-8abc-4068-9516-9fd8dea17862\"\r\n \r\n\r\n ]\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/clients/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "Export Clients",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 112|buAFQLN2KL4vfni2In1b3pqf86jEr70LAlKQFQwQb86282b9",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "file",
"type": "file",
"uuid": "643aa6c4-31ae-4c62-a7af-0d28c4ec9af5",
"src": "/C:/Users/Xpress/OneDrive/Desktop/Book1.csv"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/clients/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients",
"actions",
"export"
]
}
},
"response": []
}
]
},
{
"name": "Testimonial Dashboard",
"item": [
{
"name": "addTestimonial",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 71|y6vM87ViYEYGQDfYOOEh39ZQU6YemumkpT94HJ6q2165a313",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"client*name_en\":\"Mona\",\r\n \"client_name_ar\":\"مني\",\r\n \"job_title_en\":\"software engineer\",\r\n \"job_title_ar\":\"مهندس برمجيات\",\r\n \"testimonial_en\":\"this is perfect\",\r\n \"testimonial_ar\":\"هذا جميل\"\r\n\r\n\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/testimonials",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials"
]
}
},
"response": []
},
{
"name": "updateTestimonial",
"request": {
"method": "POST",
"header": [
{
"key": "Accept-Language",
"value": "en",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"client_name_en\":\"Ahmed1\",\r\n \"client_name_ar\":\"احمد1\",\r\n \"job_title_en\":\"ceo1\",\r\n \"job_title_ar\":\"مدير1\",\r\n \"testimonial_en\":\"1this is perfect\",\r\n \"testimonial_ar\":\"1هذا جميل\"\r\n\r\n\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/testimonials/70f02ef0-ccc7-49c3-8cb1-79a442c7d743",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"70f02ef0-ccc7-49c3-8cb1-79a442c7d743"
]
}
},
"response": []
},
{
"name": "getAllTestimonials",
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/testimonials?value=Mona",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials"
],
"query": [
{
"key": "value",
"value": "Mona"
}
]
}
},
"response": []
},
{
"name": "deleteTestimonial",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "getSpecificTestimonial",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "en",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"client_name_en\":\"Mona\",\r\n \"client_name_ar\":\"مني\",\r\n \"job_title_en\":\"software engineer\",\r\n \"job_title_ar\":\"مهندس برمجيات\",\r\n \"testimonial_en\":\"this is perfect\",\r\n \"testimonial_ar\":\"هذا جميل\"\r\n\r\n\r\n\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/testimonials/899deea3-09bf-4eac-af55-ad02130587cf",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"899deea3-09bf-4eac-af55-ad02130587cf"
]
}
},
"response": []
},
{
"name": "BulkDeleteTestimonials",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"ids\":[\r\n\r\n \"af4dc757-aa8d-4f6e-afe1-1a74197ca9fa\",\r\n \"b824b55f-3374-49e8-8a6e-f13894e4bdf5\"\r\n ]\r\n \r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/testimonials/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "ImportCsvFile",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "file",
"type": "file",
"uuid": "643aa6c4-31ae-4c62-a7af-0d28c4ec9af5",
"src": "/C:/Users/Xpress/OneDrive/Desktop/Book1.csv"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/testimonials/actions/import",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"actions",
"import"
]
}
},
"response": []
},
{
"name": "Export Testimonials",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text",
"disabled": true
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": ""
},
"url": {
"raw": "{{baseUrl}}/api/testimonials/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"actions",
"export"
]
}
},
"response": []
}
]
},
{
"name": "Section Dashboard",
"item": [
{
"name": "addSectionWithSubsection",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n\r\n \"name\":\"section1\",\r\n \"tagline\":\"tagline1\",\r\n \"subsections\":[{\"title\":\"subsection1\",\"subtitle\":\"subsection1 subtitle\"},{\"title\":\"subsection2\",\"subtitle\":\"subsection2 subtitle\"}]\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/sections",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"sections"
]
}
},
"response": []
},
{
"name": "updateSectionWithSubsection",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "{\r\n \"name\": \"الجوائز والتكريم\",\r\n \"tagline\": \"تم تكريم أعمالنا من قبل\",\r\n \"subsections\": [\r\n {\r\n \"id\": \"dc93c0f0-afee-46c4-9406-162fb69781aa\",\r\n \"title\": \"الاعتراف العالمي\",\r\n \"subtitle\": \"تم تكريمنا من قبل جهات دولية لدورنا في تعزيز الاستدامة والابتكار.\"\r\n },\r\n {\r\n \"id\": \"87e3ebd0-ae04-492b-a70d-ad5b1759f860\",\r\n \"title\": \"التميز الوطني\",\r\n \"subtitle\": \"حظينا بتأييد وزارات ومؤسسات دولة الإمارات لمساهماتنا المؤثرة.\"\r\n },\r\n {\r\n \"id\": \"35994829-d921-42de-b8f3-264162501b4d\",\r\n \"title\": \"موثوقون لدى المؤسسات الرائدة\",\r\n \"subtitle\": \"تم الاعتراف بنا من قبل المنظمات غير الحكومية والشركاء العالميين وقادة الصناعة لتحقيقنا نتائج ملموسة.\"\r\n }\r\n ]\r\n}\r\n",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/sections/update",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"sections",
"update"
]
}
},
"response": []
},
{
"name": "getSectionWithSubSection",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \"locale\":\"en\",\r\n \"subsections\":[{\r\n \"id\": \"bbb40d48-b468-41d6-af4f-854809187331\"}]\r\n\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/sections/show",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"sections",
"show"
]
}
},
"response": []
}
]
},
{
"name": "Project Dashboard",
"item": [
{
"name": "getAllProjects Copy",
"request": {
"method": "POST",
"header": [
{
"key": "Accept-Language",
"value": "en",
"type": "text",
"disabled": true
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Simplex",
"type": "text",
"uuid": "f82a12ba-b2a4-45e8-8e17-ee33e7b46931"
},
{
"key": "brief",
"value": "this is simplex",
"type": "text",
"uuid": "5b1b797d-b8ca-41ad-9a29-49a9b2271f27"
},
{
"key": "overview",
"value": "yes this is simplex",
"type": "text",
"uuid": "aa5e7868-97a8-4d23-a386-9e814172a6b1"
},
{
"key": "start_date",
"value": "01/01/2024",
"type": "text",
"uuid": "de11692d-ffe6-4ef9-a0ca-ca79795047e9"
},
{
"key": "end_date",
"value": "01/01/2025",
"type": "text",
"uuid": "6421e84d-4ee7-4080-b555-57ada10e36a0"
},
{
"key": "image_before",
"type": "file",
"uuid": "8a52c201-f60e-446c-8ac3-d04f1a5b9215",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "image*after",
"type": "file",
"uuid": "cda270d5-a841-47cb-bd65-1fa826a3a44d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "gallery[0]",
"type": "file",
"uuid": "d7e1ac1d-5903-4c49-ad60-7a2c32f7221d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/1-43lg-CTy-M5c-TTABj-C2-VEHd-A.webp"
},
{
"key": "city_id",
"value": "6b05b855-70ed-4022-b4e3-8a08a728bf9e",
"type": "text",
"uuid": "20e6ac26-3978-4155-b438-8ddaf0dc06fb"
},
{
"key": "country_id",
"value": "e1c9f73c-d5a7-4242-a93f-a41ab5c77e03",
"type": "text",
"uuid": "dd3300e3-5440-4b2e-9671-3be93fba92c0"
},
{
"key": "service_ids[0]",
"value": "ed3e9bb1-b858-474f-8c81-e837f3b44886",
"type": "text",
"uuid": "cdef879d-dce4-4ae7-9163-8cb988318fbb"
},
{
"key": "results[0][section_title]",
"value": "section1",
"type": "text",
"uuid": "bb6feeaa-9641-416d-a19e-88738c0742ff"
},
{
"key": "results[0][section_body]",
"value": "this is section 1",
"type": "text",
"uuid": "1ea1c83d-407f-4f7c-ad5c-cfb5da9c37e1"
},
{
"key": "results[1][section_title]",
"value": "section2",
"type": "text",
"uuid": "1fb84072-d424-46ce-8383-5f59f1c01f82"
},
{
"key": "results[1][section_body]",
"value": "this is section2",
"type": "text",
"uuid": "6174075d-afb7-419e-afa6-891e45d08fa4"
},
{
"key": "metrics[0][metric_title]",
"value": "metric1",
"type": "text",
"uuid": "e3800271-9b95-4853-b198-2d8479df4b63"
},
{
"key": "metrics[0][metric_number]",
"value": "100",
"type": "text",
"uuid": "1c29f7c8-00fe-4094-bda6-5243ce21d472"
},
{
"key": "metrics[0][metric_case]",
"value": "up",
"type": "text",
"uuid": "4aa77157-aab4-4f73-8172-07eac44bbaa2"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/projects/search/all-projects",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"search",
"all-projects"
],
"query": [
{
"key": "size",
"value": "2",
"disabled": true
},
{
"key": "page",
"value": "1",
"disabled": true
},
{
"key": "key",
"value": "city_ids[]=",
"disabled": true
},
{
"key": "city_ids[]",
"value": "6b05b855-70ed-4022-b4e3-8a08a728bf9e",
"disabled": true
},
{
"key": "city_ids[]",
"value": "95f9c0ee-90d8-431c-bd66-ac3038e40072",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "getAllCountries Copy",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/countries",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries"
]
}
},
"response": []
},
{
"name": "getCitiesByCountry Copy",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \r\n \"name\":\"Alex\",\r\n \"country_id\":\"e28beb2a-d554-4dc0-8fef-c7bafbe01e50\"\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/cities/country/e1c9f73c-d5a7-4242-a93f-a41ab5c77e03",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities",
"country",
"e1c9f73c-d5a7-4242-a93f-a41ab5c77e03"
]
}
},
"response": []
},
{
"name": "updateProject Copy",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"results\":[\r\n\r\n {\r\n \r\n \r\n /*\"metric_number\":200*/\r\n \r\n \"id\": \"19fcde26-8ffb-443a-9fb2-e15877e1c41e\",\r\n \"section_title\":\"11سكشن كوريا\",\r\n \"section_body\":\"للللل\"\r\n \r\n }\r\n\r\n\r\n ],\r\n\r\n \"locale\":\"ar\"\r\n\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/projects/41c47020-eeb9-42bb-89a6-10f8d7179dcf",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"41c47020-eeb9-42bb-89a6-10f8d7179dcf"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "getAllServicesNames Copy",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/services/names",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"names"
]
}
},
"response": []
},
{
"name": "getSpecificProject Copy",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Simplex",
"type": "text",
"uuid": "f82a12ba-b2a4-45e8-8e17-ee33e7b46931"
},
{
"key": "brief",
"value": "this is simplex",
"type": "text",
"uuid": "5b1b797d-b8ca-41ad-9a29-49a9b2271f27"
},
{
"key": "overview",
"value": "yes this is simplex",
"type": "text",
"uuid": "aa5e7868-97a8-4d23-a386-9e814172a6b1"
},
{
"key": "result",
"value": "result well",
"type": "text",
"uuid": "a1be8077-7a24-480a-a3ae-7c7a485b155f"
},
{
"key": "project reflected",
"value": "reflected well",
"type": "text",
"uuid": "224a9e34-ed19-4dbc-9ac1-fde81dd74a50"
},
{
"key": "start_date",
"value": "1 Dec 2024",
"type": "text",
"uuid": "de11692d-ffe6-4ef9-a0ca-ca79795047e9"
},
{
"key": "end_date",
"value": "2 Feb 2025",
"type": "text",
"uuid": "6421e84d-4ee7-4080-b555-57ada10e36a0"
},
{
"key": "image_before",
"type": "file",
"uuid": "8a52c201-f60e-446c-8ac3-d04f1a5b9215",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images (1).jpeg"
},
{
"key": "image_after",
"type": "file",
"uuid": "cda270d5-a841-47cb-bd65-1fa826a3a44d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/intersteller.png"
},
{
"key": "gallery[0]",
"type": "file",
"uuid": "d7e1ac1d-5903-4c49-ad60-7a2c32f7221d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/furnture-image.jpeg"
},
{
"key": "gallery[1]",
"type": "file",
"uuid": "93c2f982-491e-4d34-b660-bb9c743eca1f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images.png"
},
{
"key": "city_id",
"value": "7527d4a4-1bb0-48e9-84a9-d98bfec90968",
"type": "text",
"uuid": "20e6ac26-3978-4155-b438-8ddaf0dc06fb"
},
{
"key": "country_id",
"value": "e28beb2a-d554-4dc0-8fef-c7bafbe01e50",
"type": "text",
"uuid": "dd3300e3-5440-4b2e-9671-3be93fba92c0"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/projects/show/3215959c-8823-4418-8386-38b065c9bb16",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"show",
"3215959c-8823-4418-8386-38b065c9bb16"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "deleteProject Copy",
"request": {
"method": "DELETE",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Simplex",
"type": "text",
"uuid": "f82a12ba-b2a4-45e8-8e17-ee33e7b46931"
},
{
"key": "brief",
"value": "this is simplex",
"type": "text",
"uuid": "5b1b797d-b8ca-41ad-9a29-49a9b2271f27"
},
{
"key": "overview",
"value": "yes this is simplex",
"type": "text",
"uuid": "aa5e7868-97a8-4d23-a386-9e814172a6b1"
},
{
"key": "result",
"value": "result well",
"type": "text",
"uuid": "a1be8077-7a24-480a-a3ae-7c7a485b155f"
},
{
"key": "project reflected",
"value": "reflected well",
"type": "text",
"uuid": "224a9e34-ed19-4dbc-9ac1-fde81dd74a50"
},
{
"key": "start_date",
"value": "1 Dec 2024",
"type": "text",
"uuid": "de11692d-ffe6-4ef9-a0ca-ca79795047e9"
},
{
"key": "end_date",
"value": "2 Feb 2025",
"type": "text",
"uuid": "6421e84d-4ee7-4080-b555-57ada10e36a0"
},
{
"key": "image_before",
"type": "file",
"uuid": "8a52c201-f60e-446c-8ac3-d04f1a5b9215",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images (1).jpeg"
},
{
"key": "image_after",
"type": "file",
"uuid": "cda270d5-a841-47cb-bd65-1fa826a3a44d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/intersteller.png"
},
{
"key": "gallery[0]",
"type": "file",
"uuid": "d7e1ac1d-5903-4c49-ad60-7a2c32f7221d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/furnture-image.jpeg"
},
{
"key": "gallery[1]",
"type": "file",
"uuid": "93c2f982-491e-4d34-b660-bb9c743eca1f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/images.png"
},
{
"key": "city_id",
"value": "7527d4a4-1bb0-48e9-84a9-d98bfec90968",
"type": "text",
"uuid": "20e6ac26-3978-4155-b438-8ddaf0dc06fb"
},
{
"key": "country_id",
"value": "e28beb2a-d554-4dc0-8fef-c7bafbe01e50",
"type": "text",
"uuid": "dd3300e3-5440-4b2e-9671-3be93fba92c0"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/projects/6dfecfe9-3e77-4f20-a9e2-64e596c61e7b",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"6dfecfe9-3e77-4f20-a9e2-64e596c61e7b"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "addProject Copy",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "Simplex",
"type": "text",
"uuid": "f82a12ba-b2a4-45e8-8e17-ee33e7b46931"
},
{
"key": "brief",
"value": "this is simplex",
"type": "text",
"uuid": "5b1b797d-b8ca-41ad-9a29-49a9b2271f27"
},
{
"key": "overview",
"value": "yes this is simplex",
"type": "text",
"uuid": "aa5e7868-97a8-4d23-a386-9e814172a6b1"
},
{
"key": "start_date",
"value": "01/01/2024",
"type": "text",
"uuid": "de11692d-ffe6-4ef9-a0ca-ca79795047e9"
},
{
"key": "end_date",
"value": "01/01/2025",
"type": "text",
"uuid": "6421e84d-4ee7-4080-b555-57ada10e36a0"
},
{
"key": "image_before",
"type": "file",
"uuid": "8a52c201-f60e-446c-8ac3-d04f1a5b9215",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "image*after",
"type": "file",
"uuid": "cda270d5-a841-47cb-bd65-1fa826a3a44d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "gallery[0]",
"type": "file",
"uuid": "d7e1ac1d-5903-4c49-ad60-7a2c32f7221d",
"src": "/C:/Users/Xpress/OneDrive/Pictures/1-43lg-CTy-M5c-TTABj-C2-VEHd-A.webp"
},
{
"key": "city_id",
"value": "6b05b855-70ed-4022-b4e3-8a08a728bf9e",
"type": "text",
"uuid": "20e6ac26-3978-4155-b438-8ddaf0dc06fb"
},
{
"key": "country_id",
"value": "e1c9f73c-d5a7-4242-a93f-a41ab5c77e03",
"type": "text",
"uuid": "dd3300e3-5440-4b2e-9671-3be93fba92c0"
},
{
"key": "service_ids[0]",
"value": "ed3e9bb1-b858-474f-8c81-e837f3b44886",
"type": "text",
"uuid": "cdef879d-dce4-4ae7-9163-8cb988318fbb"
},
{
"key": "results[0][section_title]",
"value": "section1",
"type": "text",
"uuid": "bb6feeaa-9641-416d-a19e-88738c0742ff"
},
{
"key": "results[0][section_body]",
"value": "this is section 1",
"type": "text",
"uuid": "1ea1c83d-407f-4f7c-ad5c-cfb5da9c37e1"
},
{
"key": "results[1][section_title]",
"value": "section2",
"type": "text",
"uuid": "1fb84072-d424-46ce-8383-5f59f1c01f82"
},
{
"key": "results[1][section_body]",
"value": "this is section2",
"type": "text",
"uuid": "6174075d-afb7-419e-afa6-891e45d08fa4"
},
{
"key": "metrics[0][metric_title]",
"value": "metric1",
"type": "text",
"uuid": "e3800271-9b95-4853-b198-2d8479df4b63"
},
{
"key": "metrics[0][metric_number]",
"value": "100",
"type": "text",
"uuid": "1c29f7c8-00fe-4094-bda6-5243ce21d472"
},
{
"key": "metrics[0][metric_case]",
"value": "up",
"type": "text",
"uuid": "4aa77157-aab4-4f73-8172-07eac44bbaa2"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/projects",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "getAllCities",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/cities",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"cities"
]
}
},
"response": []
},
{
"name": "BulkDeleteProjects",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\r\n\r\n \"d4249adc-ca69-4cb0-9ef3-822c3c7db19a\",\r\n \"a507988d-c731-49c0-82ce-3eeee2faefd4\"\r\n\r\n ]\r\n \r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/projects/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "Export Projects",
"request": {
"method": "GET",
"header": []
},
"response": []
}
],
"description": "Enjoy Mr Mohamed Asharf"
},
{
"name": "Dashboard Statistics",
"item": [
{
"name": "getStatisticsDashboard",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Accept-Language",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "title",
"value": "Arab Award",
"type": "text",
"uuid": "9eebff78-8f59-4b72-a31a-0dca1a65e027"
},
{
"key": "description",
"value": "this is arab award",
"type": "text",
"uuid": "44b436bb-a97b-410f-a372-b16be553efe8"
},
{
"key": "image",
"type": "file",
"uuid": "024af0fd-10b3-4c59-8469-339e17543c5e",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "organization_name",
"value": "Korya Organization",
"type": "text",
"uuid": "133cd1aa-3d47-4bd6-8f3e-296ef4b48e07"
},
{
"key": "organization_logo",
"type": "file",
"uuid": "ed46f4e1-5146-4365-a46b-c658af85658f",
"src": "/C:/Users/Xpress/OneDrive/Pictures/nature-icon-symbol-restore-nature-simple-creative-logo-design-elegant-nature-logo-design-nature-simple-logo-vector.jpg"
},
{
"key": "url",
"value": "https://google.com",
"type": "text",
"uuid": "176c0bf7-d8a5-4f8e-8f85-65bdc118e504"
},
{
"key": "content_file",
"type": "file",
"uuid": "15c80604-f62a-4ea9-ab9a-d1780b912e56",
"src": "/C:/Users/Xpress/OneDrive/Pictures/GetResourceFile (11).pdf"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/statistics",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"statistics"
]
}
},
"response": []
}
]
},
{
"name": "QuestionWithAnswers Dashboard",
"item": [
{
"name": "addQuestionWithAnswers",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 71|y6vM87ViYEYGQDfYOOEh39ZQU6YemumkpT94HJ6q2165a313",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \"question_en\":\"what is the strongest man in the world\",\r\n \"question_ar\":\"من هو اقوي رجل في العالم\",\r\n \r\n \"answers\":[\r\n\r\n{\r\n \"answer_en\":\"Spider Man\",\r\n \"answer_ar\":\"سابيدر مان\"\r\n\r\n},\r\n\r\n{\r\n \"answer_en\":\"BatMan\",\r\n \"answer_ar\":\"بات مان\"\r\n},\r\n\r\n{\r\n \"answer_en\":\"Ahmed Khaled\",\r\n \"answer_ar\":\"احمد خالد\",\r\n \"is_accepted\":true\r\n},\r\n{\r\n \"answer_en\":\"IronMan\",\r\n \"answer_ar\":\"الرجل الحديدي\"\r\n \r\n \r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n ]\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/questions",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions"
]
}
},
"response": []
},
{
"name": "updateQuestionsWithAnswer",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 71|y6vM87ViYEYGQDfYOOEh39ZQU6YemumkpT94HJ6q2165a313",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \r\n\"answers\":[\r\n {\r\n \"id\": \"6a3e1b0e-60c9-44e2-b428-a2ea5bcd847a\",\r\n \"answer_en\": \"BatMan10\",\r\n \"answer_ar\": \"بات مان\",\r\n \"is_accepted\": false\r\n \r\n },\r\n {\r\n \"id\": \"e34064fd-441a-435f-8350-5185740555df\",\r\n \"answer_en\": \"Ahmed Khaled10\",\r\n \"answer_ar\": \"احمد خالد\",\r\n \"is_accepted\": true\r\n \r\n },\r\n {\r\n \"id\": \"49b18679-01fd-42f8-bfe6-f08ace60c92b\",\r\n \"answer_en\": \"IronMan10\",\r\n \"answer_ar\": \"الرجل الحديدي\",\r\n \"is_accepted\": false\r\n \r\n }\r\n \r\n \r\n ]\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/questions/3cfd4406-5e70-4629-b0db-f92681125f2b",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions",
"3cfd4406-5e70-4629-b0db-f92681125f2b"
]
}
},
"response": []
},
{
"name": "getSpecificQuestionWithItsAnswers",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/questions/show/b6cf1a85-92c0-402f-af9c-b1f54a0c2fbe",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions",
"show",
"b6cf1a85-92c0-402f-af9c-b1f54a0c2fbe"
]
}
},
"response": []
},
{
"name": "deleteQuestionWithAnswers",
"request": {
"method": "DELETE",
"header": [
{
"key": "Authorization",
"value": "Bearer 71|y6vM87ViYEYGQDfYOOEh39ZQU6YemumkpT94HJ6q2165a313",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \"question_en\":\"what is the strongest man in the world\",\r\n \"question_ar\":\"من هو اقوي رجل في العالم\",\r\n \r\n \"answers\":[\r\n\r\n{\r\n \"answer_en\":\"Spider Man\",\r\n \"answer_ar\":\"سابيدر مان\"\r\n\r\n},\r\n\r\n{\r\n \"answer_en\":\"BatMan\",\r\n \"answer_ar\":\"بات مان\"\r\n},\r\n\r\n{\r\n \"answer_en\":\"Ahmed Khaled\",\r\n \"answer_ar\":\"احمد خالد\",\r\n \"is_accepted\":true\r\n},\r\n{\r\n \"answer_en\":\"IronMan\",\r\n \"answer_ar\":\"الرجل الحديدي\"\r\n \r\n \r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n ]\r\n\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/questions/3cfd4406-5e70-4629-b0db-f92681125f2b",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions",
"3cfd4406-5e70-4629-b0db-f92681125f2b"
]
}
},
"response": []
},
{
"name": "searchAndGetAllQuestionsWithAnswers",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/questions?value=stro",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions"
],
"query": [
{
"key": "value",
"value": "stro",
"type": "text"
}
]
}
},
"response": []
},
{
"name": "BulkDeleteQuestions",
"request": {
"method": "POST",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\r\n\r\n \"8c302497-78cd-456d-8c04-ea3b4e5fbeb2\",\r\n \"fe9a7ca0-0bf7-4f13-985d-f94680b81861\"\r\n ]\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/questions/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "Export Questions With Answers",
"request": {
"method": "GET",
"header": []
},
"response": []
}
]
},
{
"name": "Project Page Website",
"item": [
{
"name": "getAllImagesProjectsWebsite",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/projects/website/all-images",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"website",
"all-images"
]
}
},
"response": []
},
{
"name": "getAllCountriesWithTheNoOfProjects",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/countries/website/with-project-count",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries",
"website",
"with-project-count"
]
}
},
"response": []
},
{
"name": "getCountryWithItsProjects",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/projects/website/country-with-projects?countryId=5f743488-51e0-4699-aad3-ca24b441c228&page=1&size=2",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"website",
"country-with-projects"
],
"query": [
{
"key": "countryId",
"value": "5f743488-51e0-4699-aad3-ca24b441c228",
"type": "text"
},
{
"key": "page",
"value": "1",
"type": "text"
},
{
"key": "size",
"value": "2",
"type": "text"
}
]
}
},
"response": []
},
{
"name": "getSpecificProjectWebsite",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/projects/website/show/dab5fc2e-ef90-44a4-8081-9cd5a30446c0",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"projects",
"website",
"show",
"dab5fc2e-ef90-44a4-8081-9cd5a30446c0"
]
}
},
"response": []
},
{
"name": "getSectionWithSubSectionWebsite",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \"locale\":\"en\",\r\n \"subsections\":[{\r\n \"id\": \"bbb40d48-b468-41d6-af4f-854809187331\"}]\r\n\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/sections/website/show",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"sections",
"website",
"show"
]
}
},
"response": []
},
{
"name": "getAllAwardsWebsite",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/awards/website",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"website"
]
}
},
"response": []
},
{
"name": "getSpecificAwardWebsite",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/awards/website/show/240a0e5b-430e-4da1-8b46-cae65ad197d3",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"awards",
"website",
"show",
"240a0e5b-430e-4da1-8b46-cae65ad197d3"
]
}
},
"response": []
},
{
"name": "getAllTestimnialsWebite",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/testimonials/website/all",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"testimonials",
"website",
"all"
]
}
},
"response": []
}
]
},
{
"name": "Service Page Website",
"item": [
{
"name": "getSpecificServiceWebsite",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n{\r\n \"locale\":\"en\",\r\n \"subsections\":[{\r\n \"id\": \"bbb40d48-b468-41d6-af4f-854809187331\"}]\r\n\r\n\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/services/website/show/53c28cc6-398f-4d79-a921-91b1a18cbc36",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"website",
"show",
"53c28cc6-398f-4d79-a921-91b1a18cbc36"
]
}
},
"response": []
},
{
"name": "getAllClientsWebsite",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/clients/website/all",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"clients",
"website",
"all"
]
}
},
"response": []
},
{
"name": "getAllServicesSlugsAndNamesWebsite",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": ""
},
"url": {
"raw": "{{baseUrl}}/api/services/website/all",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"website",
"all"
]
}
},
"response": []
}
]
},
{
"name": "Home Page Website",
"item": [
{
"name": "getAllQuestionWithAnswers",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/questions/website/all",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"questions",
"website",
"all"
]
}
},
"response": []
},
{
"name": "getCountriesHomePage",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/countries/website/all-countries",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"countries",
"website",
"all-countries"
]
}
},
"response": []
}
]
},
{
"name": "Navbar",
"item": [
{
"name": "getAllServicesNameAndSlugOnly",
"request": {
"method": "GET",
"header": [
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/services/website/all-services",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"services",
"website",
"all-services"
]
}
},
"response": []
}
]
},
{
"name": "Contact",
"item": [
{
"name": "addContact",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"name\":\"Ahmed\",\r\n \"email\":\"ahmedkorya1111@gmail.com\",\r\n \"phone\":\"01003674996\",\r\n \"message\":\"hello nature please i have a question can you respond me please\"\r\n}\r\n",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/contacts",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"contacts"
]
}
},
"response": []
}
]
},
{
"name": "Category Dashboard",
"item": [
{
"name": "addCategory",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name_en",
"value": "category1233",
"type": "text",
"uuid": "3fe4482c-b319-4222-9ccd-4f3ed19d9513"
},
{
"key": "name_ar",
"value": "الفئة الاولي233",
"type": "text",
"uuid": "ed7cbb67-6965-46b8-b7d9-cbd9732fd0d4"
},
{
"key": "image",
"type": "file",
"uuid": "ab88c04d-0f01-4e2e-80e1-003598e3d064",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "type",
"value": "earth",
"type": "text",
"uuid": "9a7cb860-abcc-414d-9e40-27874ad54600"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/categories",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories"
]
}
},
"response": []
},
{
"name": "updateCategory",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name_en",
"value": "category123",
"type": "text",
"uuid": "3fe4482c-b319-4222-9ccd-4f3ed19d9513"
},
{
"key": "name_ar",
"value": "الفئة الاولي",
"type": "text",
"uuid": "ed7cbb67-6965-46b8-b7d9-cbd9732fd0d4"
},
{
"key": "image",
"type": "file",
"uuid": "ab88c04d-0f01-4e2e-80e1-003598e3d064",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "type",
"value": "air",
"type": "text",
"uuid": "9a7cb860-abcc-414d-9e40-27874ad54600"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/categories/3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8"
]
}
},
"response": []
},
{
"name": "searchCategories",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "getSpecificCategory",
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 118|cTuUlNsKeQ33CYu4G41QYxjSeOl6X4aVcjkfNsCb6f03968f",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/categories/3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8"
]
}
},
"response": []
},
{
"name": "deleteCategory",
"request": {
"method": "DELETE",
"header": [
{
"key": "Authorization",
"value": "Bearer 118|cTuUlNsKeQ33CYu4G41QYxjSeOl6X4aVcjkfNsCb6f03968f",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/categories/f533c697-175b-4544-b5d9-c82bd20f5b42",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"f533c697-175b-4544-b5d9-c82bd20f5b42"
],
"query": [
{
"key": "value",
"value": "الف",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "BulkDeleteCategories",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 118|cTuUlNsKeQ33CYu4G41QYxjSeOl6X4aVcjkfNsCb6f03968f",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\"3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8\",\"1b74975c-9710-467c-a792-5d3d36408d44\"]\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/categories/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "ExportCategories",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name_en",
"value": "category1",
"type": "text",
"uuid": "3fe4482c-b319-4222-9ccd-4f3ed19d9513"
},
{
"key": "name_ar",
"value": "الفئة الاولي",
"type": "text",
"uuid": "ed7cbb67-6965-46b8-b7d9-cbd9732fd0d4"
},
{
"key": "image",
"type": "file",
"uuid": "ab88c04d-0f01-4e2e-80e1-003598e3d064",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL._AC_UF1000,1000_QL80_.jpg"
},
{
"key": "type",
"value": "earth",
"type": "text",
"uuid": "9a7cb860-abcc-414d-9e40-27874ad54600"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/categories/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"actions",
"export"
]
}
},
"response": []
}
],
"event": [
{
"listen": "prerequest",
"script": {
"type": "text/javascript",
"packages": {},
"requests": {},
"exec": [
""
]
}
},
{
"listen": "test",
"script": {
"type": "text/javascript",
"packages": {},
"requests": {},
"exec": [
""
]
}
}
]
},
{
"name": "Blog Dashboard",
"item": [
{
"name": "createBlogWithSections",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/blogs",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs"
]
}
},
"response": []
},
{
"name": "updateBlogWithSection",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"tags\":[\"بببب\",\"بببب\"],\r\n \"sections\":[\r\n \r\n {\r\n\r\n \"id\":\"a3c88ddf-3832-4085-9fcd-f9be12b876ce\",\r\n \"title\":\"قسم النشرة الاولي\",\r\n \"subtitle\":\"نعم هو\",\r\n \"quote\":\"يا سلام يا سلام\",\r\n \"quote_author\":\"احمد\",\r\n \"status\":true\r\n\r\n }\r\n \r\n ]\r\n\r\n\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/blogs/4a2f5775-f66e-4615-b253-1ae84ead4e6a",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"4a2f5775-f66e-4615-b253-1ae84ead4e6a"
]
}
},
"response": []
},
{
"name": "getSpecificBlog",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/blogs/a70016f9-8021-43cb-a665-0604030d0250",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"a70016f9-8021-43cb-a665-0604030d0250"
]
}
},
"response": []
},
{
"name": "searchBlogs",
"request": {
"method": "GET",
"header": []
},
"response": []
},
{
"name": "deleteBlog",
"request": {
"method": "DELETE",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
}
],
"url": {
"raw": "{{baseUrl}}/api/blogs/3d92d703-5e42-441d-9a44-959bbe28119f",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"3d92d703-5e42-441d-9a44-959bbe28119f"
]
}
},
"response": []
},
{
"name": "BulkDeleteBlogs",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\"4efb35b8-c866-4b5e-92d4-4efc60d51c74\",\"f2eeede5-5b90-4f90-adac-1f6f342896c5\"]\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "{{baseUrl}}/api/blogs/actions/bulk-delete",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"actions",
"bulk-delete"
]
}
},
"response": []
},
{
"name": "getPublishedCategories",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/categories/published",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"published"
]
}
},
"response": []
},
{
"name": "ExportBlogs",
"request": {
"method": "POST",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text",
"disabled": true
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/blogs/actions/export",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"actions",
"export"
]
}
},
"response": []
}
]
},
{
"name": "Blog Website",
"item": [
{
"name": "getAllCategories",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/categories/website/all-categories",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"website",
"all-categories"
]
}
},
"response": []
},
{
"name": "getCategoryWithItsBlogs",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{baseUrl}}/api/categories/website/category-with-blogs/dba6ef01-be1f-4044-b4b3-98e15b96cdd0?size=1&page=2",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"website",
"category-with-blogs",
"dba6ef01-be1f-4044-b4b3-98e15b96cdd0"
],
"query": [
{
"key": "size",
"value": "1",
"type": "text"
},
{
"key": "page",
"value": "2",
"type": "text"
}
]
}
},
"response": []
},
{
"name": "getCategoryBlogsTags",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/categories/website/category-blogs-tags/2afac3fe-e382-4016-acb0-5b799f8f8a98",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"categories",
"website",
"category-blogs-tags",
"2afac3fe-e382-4016-acb0-5b799f8f8a98"
]
}
},
"response": []
},
{
"name": "getSpecificBlogWebsite",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 117|45QxMjNGgwktaWTG2m1IzMVoy2HGVt6KDGmBt7UM6f9c5c59",
"type": "text"
},
{
"key": "locale",
"value": "en",
"type": "text"
}
],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "name",
"value": "blog1",
"type": "text",
"uuid": "caa41227-fa76-4080-9c63-e5c86c69ad66"
},
{
"key": "category*id",
"value": "2afac3fe-e382-4016-acb0-5b799f8f8a98",
"type": "text",
"uuid": "e943edee-e320-4d8e-8ad5-7e363fef45db"
},
{
"key": "image",
"type": "file",
"uuid": "b9bb532e-b48e-4e44-ba31-3b0511340827",
"src": "/C:/Users/Xpress/OneDrive/Pictures/91yS4MChltL.\_AC_UF1000,1000_QL80*.jpg"
},
{
"key": "sections[0][title]",
"value": "title1",
"type": "text",
"uuid": "e6d56021-3a85-4538-8cc6-63314cb26358"
},
{
"key": "sections[0][subtitle]",
"value": "subtitle1",
"type": "text",
"uuid": "716cb91b-54b4-4380-a65a-cfefbbd66b40"
},
{
"key": "sections[0][image]",
"type": "file",
"uuid": "0ce237bb-e563-4002-b5e9-e2a4c4d9e4ae",
"src": "/C:/Users/Xpress/OneDrive/Pictures/ahmed-iti-Photoroom.jpg"
},
{
"key": "sections[0][quote]",
"value": "impressive quote",
"type": "text",
"uuid": "3e960d5d-8f9e-4f30-ac0d-a22f25e088d5"
},
{
"key": "sections[0][quote_author]",
"value": "ahmed",
"type": "text",
"uuid": "bc1b5324-297f-4635-8724-210d8bd844cc"
},
{
"key": "status",
"value": "1",
"type": "text",
"uuid": "70ae30be-f325-4212-9a1c-0fe83ed72849"
},
{
"key": "sections[0][tags][0]",
"value": "tag1",
"type": "text",
"uuid": "168edf54-f2d0-4412-bcac-357eda39fe49"
},
{
"key": "sections[0][tags][1]",
"value": "tag2",
"type": "text",
"uuid": "b6347ae8-22a7-4792-a257-7500d5dd9aa4"
}
]
},
"url": {
"raw": "{{baseUrl}}/api/blogs/website/get-blog/f0d79c33-a081-4119-9dce-3b8a121e1e4c",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"website",
"get-blog",
"f0d79c33-a081-4119-9dce-3b8a121e1e4c"
]
}
},
"response": []
},
{
"name": "getBlogViewsForCategory",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer 118|cTuUlNsKeQ33CYu4G41QYxjSeOl6X4aVcjkfNsCb6f03968f",
"type": "text"
},
{
"key": "locale",
"value": "ar",
"type": "text"
}
],
"body": {
"mode": "raw",
"raw": "\r\n\r\n{\r\n \"ids\":[\"3eaa1e2b-7df1-49d8-afc6-a5fb02128ca8\",\"1b74975c-9710-467c-a792-5d3d36408d44\"]\r\n}"
},
"url": {
"raw": "{{baseUrl}}/api/blogs/views/dba6ef01-be1f-4044-b4b3-98e15b96cdd0",
"host": [
"{{baseUrl}}"
],
"path": [
"api",
"blogs",
"views",
"dba6ef01-be1f-4044-b4b3-98e15b96cdd0"
]
}
},
"response": []
}
]
}
],
"variable": [
{
"key": "baseUrl",
"value": "",
"type": "default"
}
]
}
