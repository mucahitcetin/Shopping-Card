// html etiketleini seçme işlemi
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn  =  document.querySelector(".clear-btn");


//düzenleme seçenekleri
let editElement;
let editFlag = false; // düzenleme modunda olup olmadığını belirtir.
let editID = ""; // Düzenleme yapılan öğenin benzersiz kimliği

//olay izleyicileri
form.addEventListener('submit', addItem);
// sayfa yüklendiğinde setupItems fonksiyonunu çağır
window.addEventListener("DOMContentLoaded", setupItems);

//fonksiyonlar
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function addItem(e) {
    e.preventDefault();//formun otomatik olarak gönderilmesini engelliyoruz.
    const value = grocery.value; // form içerinde bulunan inputun değerini alma
    const id = new Date().getTime().toString(); // benzersiz bir id oluşturma

    // eğer değer boş değilse ve düzenleme modunda değilse
    if (value !== "" && !editFlag) {
        const element = document.createElement("article"); // yeni bir article öğesi oluşturulması
        let attr = document.createAttribute("data-id"); // yeni bir veri kimliği oluşturur
        attr.value = id;
        element.setAttributeNode(attr); // oluşturduğumuz id'yi elemente ekledik
        element.classList.add("grocery-item"); // oluşturduğumuz elemente class ekledik
        element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
    <button type="button" class="edit-btn">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button type="button" class="delete-btn">
        <i class="fa-solid fa-trash"></i>
    </button>
    </div>

`;
        const deleteBtn = element.querySelector('.delete-btn');
        // sil butonuna tıklama olayı
        deleteBtn.addEventListener('click', deleteItem);

        //  düzenle butonuna tıklama olayı
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);

        // kapsayıcıya ekleme yapma
        list.appendChild(element);
        // alert
        displayAlert("Başarıyla Eklendi", "success");
        container.classList.add("show-container");
        // içerik kısmını sıfırlama
        setBackToDefault();
         // localStorage ekleme
    addToLocalStorage(id, value);
        } else if (value !== "" && editFlag ) { // düzenleme modu
            editElement.innerHTML = value;
            displayAlert("Değer Değiştirildi", "success");
            setBackToDefault();
    } else{
        displayAlert("Lütfen bir değer giriniz.", "danger");
    }
}
// temizleme
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
  }
// silme fonksiyonu
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    /* console.log(element); */
    const id = element.dataset.id; // localStorage kullanılacak
    list.removeChild(element);
  
    displayAlert("Öğe Kaldırıldı", "danger");

     // yerel depodan kaldır
  removeFromLocalStorage(id);
  }

// düzenleme fonksiyonu
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // düzenleme yapılan öğeyi seç
    editElement = e.currentTarget.parentElement.previousElementSibling;
     // form içerisinde bulunan inputun değerini düzenlenen öğenin metniyle doldur.
  grocery.value = editElement.innerHTML;
  
  editFlag = true;
  editID = element.dataset.id; // düzenlenen öğenin kimliği
  submitBtn.textContent = "Düzenle";
 }

 //Tümünü temizle butonuna click olayı ekle
 clearBtn.addEventListener('click', () => {
     while (list.firstChild) {
         list.removeChild(list.firstChild);
     }
     displayAlert("Tümü Temizlendi", "danger");
 });

 //! localStorage işlemleri
// yerel depoya öğe ekleme işlemi
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
  }
  
  // localStoragedan verileri alma işlemi
  function getLocalStorage() {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  }
  function removeFromLocalStorage(id) {
    let items = getLocalStorage();
  
    items = items.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });
  }
  function editLocalStorage(id, value) {}
  
  function setupItems() {
    let items = getLocalStorage();
  }