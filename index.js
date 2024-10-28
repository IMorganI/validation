// Набір мов для перекладу
const languages = {
  ru: {
    name: "Имя",
    lastName: "Фамилия",
    email: "E-Mail",
    btn: "Зарегистрироваться",
    age: "Я старше 18 лет",
    citizen:
      "Я гражданин(ка) <span class='country-name'>указанной страны</span>",
  },
  it: {
    name: "Inserire il proprio nome",
    lastName: "Inserire il cognome",
    email: "Inserire l'indirizzo e-mail",
    btn: "ISCRIVITI",
    age: "Ho più di 18 anni",
    citizen: "Sono cittadino di <span class='country-name'>questo paese</span>",
  },
  de: {
    name: "Name",
    lastName: "Nachname",
    email: "E-Mail",
    btn: "Registrieren",
    age: "Ich bin über 18",
    citizen:
      "Ich bin Bürger von <span class='country-name'>dem angegebenen Land</span>",
  },
  en: {
    name: "Insert name",
    lastName: "Insert last name",
    email: "Insert email",
    btn: "Register now",
    age: "I am over 18",
    citizen:
      "I am a citizen of <span class='country-name'>the specified country</span>",
  },
  tr: {
    name: "Adı",
    lastName: "Soyadı",
    email: "E-posta",
    btn: "ŞİMDİ KATILIN!",
    age: "18 yaşından büyüğüm",
    citizen:
      "Ben <span class='country-name'>belirtilen ülkenin</span> vatandaşıyım",
  },
  sk: {
    name: "Meno",
    lastName: "Priezvisko",
    email: "E-Mail",
    btn: "Registrovať sa",
    age: "Mám viac ako 18 rokov",
    citizen: "Som občan(ka) <span class='country-name'>uvedenej krajiny</span>",
  },
  pl: {
    name: "Imię",
    lastName: "Nazwisko",
    email: "E-mail",
    btn: "Zarejestruj się",
    age: "Mam więcej niż 18 lat",
    citizen:
      "Jestem obywatelem(obywatelką) <span class='country-name'>wskazanego kraju</span>",
  },
  // Інші мови тут
};

// Функція для отримання параметра з URL
function getUTMParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Функція для отримання даних про країну та мову за IP
async function getCountryAndLanguageByIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching country and language data:", error);
    return {
      country_code: "us",
      languages: "en",
      country_name: "United States",
    }; // За замовчуванням англійська
  }
}

// Функція для вставки HTML форми
function insertForm(container, index) {
  const formHTML = `
    <div class="form-group">
      <input type="text" id="firstname-${index}" name="firstname" placeholder="First Name" required>
    </div>
    <div class="form-group">
      <input type="text" id="lastname-${index}" name="lastname" placeholder="Last Name" required>
    </div>
    <div class="form-group">
      <input type="email" id="email-${index}" name="email" placeholder="Email" required>
    </div>
    <div class="form-group">
      <input type="tel" id="phone-${index}" name="phone" class="phone-input" placeholder="Phone" required>
    </div>
    <div class="checkbox-group">
      <label for="age-${index}">
        <input type="checkbox" id="age-${index}" name="age" required> I am over 18
      </label>
      <label id="citizen-label-${index}">
        <input type="checkbox" id="citizen-${index}" name="citizen" required> I am a citizen of <span class="country-name">the specified country</span>
      </label>
    </div>
    <button type="submit" class="btn-submit">Submit</button>
    <div id="error-message-${index}" style="display:none; color: red;"></div>
  `;
  container.innerHTML = formHTML;
}

// Функція для перекладу форми на мову користувача
function translateForm(container, languageCode, index) {
  const translation = languages[languageCode];

  if (!translation) {
    console.error(`Translation not found for language: ${languageCode}`);
    return;
  }

  const firstnameInput = container.querySelector(`#firstname-${index}`);
  const lastnameInput = container.querySelector(`#lastname-${index}`);
  const emailInput = container.querySelector(`#email-${index}`);
  const submitButton = container.querySelector(".btn-submit");
  const ageLabel = container.querySelector(`label[for='age-${index}']`);
  const citizenLabel = container.querySelector(`#citizen-label-${index}`);

  if (firstnameInput) {
    firstnameInput.setAttribute("placeholder", translation.name);
  }
  if (lastnameInput) {
    lastnameInput.setAttribute("placeholder", translation.lastName);
  }
  if (emailInput) {
    emailInput.setAttribute("placeholder", translation.email);
  }
  if (submitButton) {
    submitButton.textContent = translation.btn;
  }
  if (ageLabel) {
    ageLabel.innerHTML = `<input type="checkbox" id="age-${index}" name="age" required> ${translation.age}`;
  }
  if (citizenLabel) {
    citizenLabel.innerHTML = `<input type="checkbox" id="citizen-${index}" name="citizen" required> ${translation.citizen}`;
  }

  console.log(`Form translated to ${languageCode}`);
}

// Завантаження скрипту Facebook Pixel з Promise
function loadFbPixelScript() {
  return new Promise((resolve, reject) => {
    if (
      document.querySelector(
        'script[src="https://connect.facebook.net/en_US/fbevents.js"]'
      )
    ) {
      console.log("Facebook Pixel script already loaded.");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.async = true;
    script.onload = () => {
      console.log("Facebook Pixel script loaded.");
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load Facebook Pixel script.");
      reject(new Error("Failed to load Facebook Pixel script."));
    };
    document.head.appendChild(script);
  });
}

// Функція для завантаження та ініціалізації Facebook Pixel
async function loadAndInitFbPixel(pixelId) {
  if (!pixelId) {
    console.error("Facebook Pixel ID не вказано.");
    return;
  }

  if (window.fbq) {
    fbq("init", pixelId);
    fbq("track", "PageView");
    console.log(`Facebook Pixel ${pixelId} initialized and PageView tracked.`);
    return;
  }

  await loadFbPixelScript();

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
  console.log(`Facebook Pixel ${pixelId} initialized and PageView tracked.`);
}

// Функція для відправки події Facebook Pixel
function sendFbPixelEvent(eventName = "Lead") {
  if (typeof fbq !== "function") {
    console.error(
      "fbq не визначено. Переконайтесь, що Facebook Pixel завантажено правильно."
    );
    return;
  }

  fbq("track", eventName);
  console.log(`Facebook Pixel Event "${eventName}" відправлено.`);
}

// Ініціалізація телефонних полів вводу та оновлення назви країни
async function initPhoneInputs(geoData) {
  const countryCode = geoData.country_code
    ? geoData.country_code.toLowerCase()
    : "us";
  const countryName = geoData.country_name || "United States";

  // Оновлюємо текст у спані з класом "country-name"
  const countryNameSpans = document.querySelectorAll(".country-name");
  countryNameSpans.forEach(function (span) {
    span.innerHTML = countryName;
  });

  const inputs = document.querySelectorAll(".phone-input");
  inputs.forEach(function (input) {
    const iti = window.intlTelInput(input, {
      initialCountry: countryCode,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Оновлюємо placeholder з кодом країни
    const placeholder = `+${iti.getSelectedCountryData().dialCode}`;
    input.setAttribute("placeholder", placeholder);
  });
}

// Функція для завантаження та ініціалізації gtag.js
function loadGtag() {
  return new Promise((resolve, reject) => {
    var utm1 = getParameterByName("utm1");

    if (!utm1) {
      console.warn("UTM-параметр 'utm1' не знайдено.");
      reject("UTM-параметр 'utm1' не знайдено.");
      return;
    }

    if (window.gtag) {
      console.log("gtag вже завантажено.");
      resolve();
      return;
    }

    var gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + utm1;

    gtagScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag; // Робимо gtag глобально доступним
      gtag("js", new Date());
      gtag("config", utm1);
      console.log("gtag.js успішно завантажено.");
      resolve();
    };

    gtagScript.onerror = () => {
      console.error("Не вдалося завантажити gtag.js.");
      reject("Не вдалося завантажити gtag.js.");
    };

    document.head.appendChild(gtagScript);
  });
}

// Функція для відправки події конверсії Google
function sendConversionEvent() {
  var utm1 = getParameterByName("utm1");
  var utm2 = getParameterByName("utm2");

  // Логуємо отримані значення utm1 та utm2
  console.log("Отримані значення для конверсії - utm1:", utm1, ", utm2:", utm2);

  if (utm1 && utm2) {
    if (typeof gtag === "function") {
      gtag("event", "conversion", {
        send_to: utm1 + "/" + utm2,
      });
      console.log(`Google Analytics conversion event sent to ${utm1}/${utm2}`);
    } else {
      console.error(
        "gtag не визначено. Переконайтеся, що gtag.js завантажено."
      );
    }
  } else {
    console.warn("UTM-параметри utm1 та utm2 відсутні.");
  }
}

// Функція для отримання параметрів з URL
function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Ініціалізуємо форми і телефонні поля вводу після завантаження сторінки
document.addEventListener("DOMContentLoaded", async function () {
  const geoData = await getCountryAndLanguageByIP();
  console.log("GeoData fetched:", geoData); // Виводимо геодані в консоль

  // Завантажуємо gtag.js
  try {
    await loadGtag();
  } catch (error) {
    console.error("Помилка при завантаженні gtag.js:", error);
  }

  await initForm(geoData);
});

async function initForm(geoData) {
  const userLanguages = geoData.languages
    ? geoData.languages.split(",")
    : ["en"];
  const primaryLanguage = userLanguages[0].split("-")[0].trim().toLowerCase(); // Основна мова

  console.log(`Primary language detected: ${primaryLanguage}`);

  // Знаходимо всі контейнери для форми
  const formContainers = document.querySelectorAll(".regForm");

  if (formContainers.length > 0) {
    formContainers.forEach(async (formContainer, index) => {
      // Вставляємо форму з унікальним індексом
      insertForm(formContainer, index);

      // Отримуємо форму
      const form = formContainer.closest("form"); // Знаходимо батьківський елемент form
      const preloader = document.getElementById("preloader"); // Отримуємо прелоадер
      const errorMessage = form.querySelector(`#error-message-${index}`);

      // Перекладаємо форму
      if (languages[primaryLanguage]) {
        translateForm(formContainer, primaryLanguage, index);
      } else {
        translateForm(formContainer, "en", index); // Переклад на дефолтну мову
      }

      // Ініціалізуємо телефонні поля вводу
      initPhoneInputs(geoData);

      // Отримуємо Pixel ID з прихованого інпуту 'fbp'
      let pixelId = form.querySelector('input[name="fbp"]')?.value;

      // Якщо Pixel ID не встановлено, спробуємо отримати з UTM-параметра 'fbp'
      if (!pixelId) {
        pixelId = getUTMParameter("fbp");
        if (pixelId) {
          // Встановлюємо Pixel ID у прихований інпут 'fbp'
          let fbpInput = form.querySelector('input[name="fbp"]');
          if (!fbpInput) {
            fbpInput = document.createElement("input");
            fbpInput.type = "hidden";
            fbpInput.name = "fbp";
            form.appendChild(fbpInput);
          }
          fbpInput.value = pixelId;
        }
      }

      if (pixelId) {
        await loadAndInitFbPixel(pixelId);
      } else {
        console.error(
          "Pixel ID не знайдено в прихованому інпуті 'fbp' або через UTM-параметр 'fbp'."
        );
      }

      let isSubmitting = false;

      // Додаємо обробник події для відправки форми
      form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Запобігаємо стандартній відправці форми

        if (isSubmitting) {
          return; // Якщо вже відправляється, не робимо нічого
        }

        isSubmitting = true; // Встановлюємо прапорець

        const phoneInput = form.querySelector(".phone-input");
        const iti = window.intlTelInputGlobals.getInstance(phoneInput);

        // Перевіряємо валідність телефону
        if (!iti.isValidNumber()) {
          alert("Невірний номер телефону");
          isSubmitting = false; // Скидаємо прапорець, якщо номер неправильний
          return;
        }

        const formData = new FormData(form);

        // Додаємо номер телефону у міжнародному форматі до formData
        formData.set("phone", iti.getNumber());

        // Додаємо country_code до formData
        const countryCodeToSend = geoData.country_code || "us";
        formData.set("country_code", countryCodeToSend);

        // Показуємо прелоадер перед відправкою форми
        if (preloader) {
          preloader.classList.remove("hidden");
        }

        try {
          const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          });

          const result = await response.json();

          // Якщо отримали redirectUrl, виконуємо редирект
          if (result.redirectUrl) {
            console.log(
              "Success response received, redirecting to:",
              result.redirectUrl
            );
            errorMessage.style.display = "none";

            // Спочатку спробуємо відправити пікселі, але не чекаємо на їх результат
            try {
              const fbpInput = form.querySelector('input[name="fbp"]');
              const formPixelId = fbpInput ? fbpInput.value : null;

              if (formPixelId && window.fbq) {
                // Відправляємо подію конверсії у Facebook Pixel
                sendFbPixelEvent("Lead");
              } else {
                console.error(
                  "Facebook Pixel не ініціалізовано або ID не знайдено."
                );
              }

              // Відправляємо подію в Google Analytics
              sendConversionEvent();
            } catch (pixelError) {
              console.error("Error sending pixels:", pixelError);
              // Але редирект все одно має відбутися
            }

            // Ховаємо прелоадер і виконуємо редирект
            if (preloader) {
              preloader.classList.add("hidden");
            }

            window.location.href = result.redirectUrl; // Виконуємо редирект
          } else {
            throw new Error(result.message || "Redirect URL not found.");
          }
        } catch (error) {
          // Якщо сталася помилка
          console.error("Error occurred:", error);

          // Ховаємо прелоадер перед показом повідомлення про помилку
          if (preloader) {
            preloader.classList.add("hidden");
          }

          // Показуємо повідомлення про помилку
          errorMessage.style.display = "block";
          errorMessage.textContent =
            "Something went wrong. Please try again later.";
        } finally {
          isSubmitting = false; // Скидаємо прапорець після завершення запиту
        }
      });
    });
  }
}
