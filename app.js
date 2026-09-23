/*
 * CV builder — vanilla JS, no dependencies.
 * Data is kept in localStorage, the CV is the front page, and the
 * download menu exports PDF (print), PNG or JPG.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "cvraft-data";

  var defaultData = {
    name: "Pritam Kumar Modak",
    phone: "+91 9064662830",
    email: "modakpritam06@gmail.com",
    linkedin: "pritam-modak-267164288",
    github: "2006pritam",
    location: "Kalna, West Bengal",
    photo: "",
    pageBorder: false,
    objective:
      "Motivated Computer Applications student with a strong foundation in software development, web technologies, and quantum computing. Proven experience through internships in web development, cybersecurity, and research. Aspiring to contribute technical skills in Python, React.js, and JavaScript to innovative software solutions.",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Supreme Institute of Management and Technology (MAKAUT University)",
    graduation: "Expected 2026",
    score: "Sem scores: 7.45 · 7.05 · 7.24 · 6.52",
    school: "Maharaja's High School, Kalna · 12th: 73.2% · 10th: 75%",
    role1: "Research Intern",
    org1: "Calcutta University Technology Campus",
    dates1: "Present",
    desc1: "Cancer Detection System using Qubits (Quantum Computing)",
    role2: "Cyber Security Intern",
    org2: "CodeAlpha",
    dates2: "Jan 2025 – Mar 2025",
    role3: "Web Development Intern",
    org3: "Skillcraft Technology",
    dates3: "Apr 2024 – Jul 2024",
    languages: "Python, C, C++, JavaScript (ES6+), TypeScript",
    web: "HTML5, CSS3, React.js",
    database: "MySQL",
    projects:
      "Front Page Builder (React/TS), Weather Forecast System (API), Password Generator, Personal Portfolio.",
    certifications:
      "Python for Data Science – IBM (2025) · Advanced JavaScript – HackerRank (2024) · Basic Computer Skills – Brainpower Computer Academy",
    dob: "19.01.2006",
    nationality: "Indian",
    spoken: "English, Bengali, Hindi",
    place: "Kalna, West Bengal",
    educationItems: [
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "Supreme Institute of Management and Technology (MAKAUT University)",
        dates: "Expected 2026",
        score: "Sem scores: 7.45 · 7.05 · 7.24 · 6.52",
      },
      {
        degree: "Higher Secondary (12th) & Secondary (10th)",
        institution: "Maharaja's High School, Kalna",
        dates: "2023 | 2021",
        score: "12th: 73.2% · 10th: 75%",
      },
    ],
    experienceItems: [
      { role: "Research Intern", org: "Calcutta University Technology Campus", dates: "Present", desc: "Cancer Detection System using Qubits (Quantum Computing)" },
      { role: "Cyber Security Intern", org: "CodeAlpha", dates: "Jan 2025 – Mar 2025", desc: "" },
      { role: "Web Development Intern", org: "Skillcraft Technology", dates: "Apr 2024 – Jul 2024", desc: "" },
    ],
    skillItems: [
      { label: "Languages", value: "Python, C, C++, JavaScript (ES6+), TypeScript" },
      { label: "Web & Tools", value: "HTML5, CSS3, React.js" },
      { label: "Databases", value: "MySQL" },
    ],
    projectItems: [
      { name: "Front Page Builder", detail: "React/TS" },
      { name: "Weather Forecast System", detail: "API" },
      { name: "Password Generator", detail: "" },
      { name: "Personal Portfolio", detail: "" },
    ],
    certificationItems: [
      { name: "Python for Data Science", issuer: "IBM", date: "2025" },
      { name: "Advanced JavaScript", issuer: "HackerRank", date: "2024" },
      { name: "Basic Computer Skills", issuer: "Brainpower Computer Academy", date: "2013–2019" },
    ],
  };

  var FIELDS = [
    {
      title: "Contact",
      hint: "Place this at the very top of the CV, exactly as recruiters should reach you.",
      fields: [
        { key: "name", label: "Full name", full: true },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email", type: "email" },
        { key: "linkedin", label: "LinkedIn (username or URL)" },
        { key: "github", label: "GitHub (username or URL)" },
        { key: "location", label: "Location", full: true },
        { key: "photo", label: "Profile photo (optional)", type: "file", full: true },
        { key: "pageBorder", label: "Add page border", type: "checkbox", full: true },
      ],
    },
    {
      title: "Summary",
      hint: "2–4 plain sentences. ATS software reads sentences better than graphics.",
      fields: [
        { key: "objective", label: "Professional summary", type: "textarea", full: true },
      ],
    },
    {
      title: "Experience",
      hint: "Most recent first. Leave a role blank to hide it from the CV.",
      repeatable: { key: "experienceItems", title: "experience", fields: [{ key: "role", label: "Role" }, { key: "org", label: "Organization" }, { key: "dates", label: "Dates" }, { key: "desc", label: "What you did", type: "textarea", full: true }] },
    },
    {
      title: "Education",
      repeatable: { key: "educationItems", title: "education", fields: [{ key: "degree", label: "Degree", full: true }, { key: "institution", label: "Institution", full: true }, { key: "dates", label: "Graduation / dates" }, { key: "score", label: "Score / GPA", full: true }] },
    },
    {
      title: "Skills",
      hint: "Comma separated. Reuse the exact words from the job ad.",
      repeatable: { key: "skillItems", title: "skill group", fields: [{ key: "label", label: "Category" }, { key: "value", label: "Skills", full: true }] },
    },
    {
      title: "Projects",
      repeatable: { key: "projectItems", title: "project", fields: [{ key: "name", label: "Project name" }, { key: "detail", label: "Technology / result", full: true }] },
    },
    {
      title: "Certifications",
      repeatable: { key: "certificationItems", title: "certification", fields: [{ key: "name", label: "Certificate" }, { key: "issuer", label: "Issuer" }, { key: "date", label: "Date" }] },
    },
    {
      title: "Personal details",
      hint: "Optional. Keep only what helps this application.",
      fields: [
        { key: "dob", label: "Date of birth" },
        { key: "nationality", label: "Nationality" },
        { key: "spoken", label: "Languages spoken" },
        { key: "place", label: "Place" },
      ],
    },
  ];

  var data = loadData();
  var zoom = 1;
  var autoZoom = true;
  var saveTimer = null;

  /* ------------------------------------------------------------------ */
  /* storage                                                             */
  /* ------------------------------------------------------------------ */
  function loadData() {
    var base = {};
    for (var k in defaultData) base[k] = defaultData[k];
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        for (var key in base) if (saved[key] != null) base[key] = saved[key];
        if (!saved.educationItems) {
          base.educationItems = [{ degree: base.degree, institution: base.institution, dates: base.graduation, score: base.score }, { degree: "Higher Secondary (12th) & Secondary (10th)", institution: "Maharaja's High School, Kalna", dates: "2023 | 2021", score: base.school }];
        }
        if (!saved.experienceItems) {
          base.experienceItems = [1, 2, 3].map(function (i) { return { role: base["role" + i], org: base["org" + i], dates: base["dates" + i], desc: base["desc" + i] }; });
        }
        if (!saved.skillItems) base.skillItems = [{ label: "Languages", value: base.languages }, { label: "Web & Tools", value: base.web }, { label: "Databases", value: base.database }];
        if (!saved.projectItems) base.projectItems = String(base.projects || "").split(",").map(function (item) { return { name: item.trim().replace(/\.$/, ""), detail: "" }; }).filter(function (item) { return has(item.name); });
        if (!saved.certificationItems) base.certificationItems = String(base.certifications || "").split(" · ").map(function (item) { return { name: item.trim(), issuer: "", date: "" }; }).filter(function (item) { return has(item.name); });
      }
    } catch (e) {
      /* ignore corrupt storage */
    }
    return base;
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* storage may be unavailable (private mode) */
    }
    var status = document.getElementById("saveStatus");
    status.textContent = "Saving…";
    status.classList.add("saving");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      status.textContent = "Saved";
      status.classList.remove("saving");
    }, 350);
  }

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */
  function has(v) {
    return v != null && String(v).trim() !== "";
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function nl2br(v) {
    return esc(v).replace(/\r?\n/g, "<br>");
  }

  function linkIn(v) {
    var s = String(v).trim();
    if (/^https?:\/\//i.test(s) || /linkedin\.com/i.test(s)) return s.replace(/^https?:\/\//i, "");
    return "linkedin.com/in/" + s;
  }

  function gitHub(v) {
    var s = String(v).trim();
    if (/^https?:\/\//i.test(s) || /github\.com/i.test(s)) return s.replace(/^https?:\/\//i, "");
    return "github.com/" + s;
  }

  function slug() {
    return (has(data.name) ? String(data.name) : "My").trim().replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "") || "CV";
  }

  function fileName() {
    return slug() + "_CV";
  }

  /* ------------------------------------------------------------------ */
  /* render CV                                                           */
  /* ------------------------------------------------------------------ */
  function setBlock(sectionId, targetId, html) {
    document.getElementById(targetId).innerHTML = html;
    document.getElementById(sectionId).style.display = html.trim() ? "" : "none";
  }

  function contactHTML() {
    var parts = [];
    if (has(data.location)) parts.push(esc(data.location));
    if (has(data.phone)) parts.push(esc(data.phone));
    if (has(data.email)) parts.push(esc(data.email));
    if (has(data.linkedin)) parts.push(esc(linkIn(data.linkedin)));
    if (has(data.github)) parts.push(esc(gitHub(data.github)));
    return parts.join('<span class="cv-sep">•</span>');
  }

  function experienceHTML() {
    var out = [];
    var items = data.experienceItems || [];
    items.forEach(function (item) {
      var role = item.role;
      var org = item.org;
      var dates = item.dates;
      var desc = item.desc;
      if (!has(role) && !has(org)) return;
      out.push(
        '<div class="cv-item">' +
          '<div class="cv-row">' +
            (has(role) ? '<span class="cv-role">' + esc(role) + "</span>" : "<span></span>") +
            (has(dates) ? '<span class="cv-date">' + esc(dates) + "</span>" : "") +
          "</div>" +
          (has(org) ? '<div class="cv-sub">' + esc(org) + "</div>" : "") +
          (has(desc) ? '<div class="cv-desc">' + nl2br(desc) + "</div>" : "") +
        "</div>"
      );
    });
    return out.join("");
  }

  function educationHTML() {
    var out = [];
    (data.educationItems || []).forEach(function (item) {
      if (!has(item.degree) && !has(item.institution) && !has(item.score)) return;
      out.push(
        '<div class="cv-item">' +
          '<div class="cv-row">' +
            (has(item.degree) ? '<span class="cv-role">' + esc(item.degree) + "</span>" : "<span></span>") +
            (has(item.dates) ? '<span class="cv-date">' + esc(item.dates) + "</span>" : "") +
          "</div>" +
          (has(item.institution) ? '<div class="cv-sub">' + esc(item.institution) + "</div>" : "") +
          (has(item.score) ? '<div class="cv-desc">' + esc(item.score) + "</div>" : "") +
        "</div>"
      );
    });
    return out.join("");
  }

  function skillsHTML() {
    return (data.skillItems || []).filter(function (item) { return has(item.value); }).map(function (item) {
      return '<div class="cv-line"><strong>' + esc(item.label || "Skills") + ':</strong> ' + esc(item.value) + '</div>';
    }).join("");
  }

  function projectsHTML() {
    return (data.projectItems || []).filter(function (item) { return has(item.name) || has(item.detail); }).map(function (item) {
      return '<div class="cv-line"><strong>' + esc(item.name) + '</strong>' + (has(item.detail) ? ' — ' + esc(item.detail) : '') + '</div>';
    }).join("");
  }

  function certificationsHTML() {
    return (data.certificationItems || []).filter(function (item) { return has(item.name) || has(item.issuer); }).map(function (item) {
      var suffix = [item.issuer, item.date].filter(has).join(' · ');
      return '<div class="cv-line"><strong>' + esc(item.name) + '</strong>' + (suffix ? ' — ' + esc(suffix) : '') + '</div>';
    }).join("");
  }

  function lineList(rows) {
    return rows
      .filter(function (r) {
        return has(r[1]);
      })
      .map(function (r) {
        return '<div class="cv-line"><strong>' + r[0] + ":</strong> " + esc(r[1]) + "</div>";
      })
      .join("");
  }

  function renderCV() {
    document.getElementById("cvName").textContent = has(data.name) ? data.name : "";
    document.getElementById("cvContact").innerHTML = contactHTML();
    var photo = document.getElementById("cvPhoto");
    photo.innerHTML = has(data.photo) ? '<img src="' + esc(data.photo) + '" alt="Profile photo">' : '<span>PHOTO</span>';
    photo.classList.toggle("has-photo", has(data.photo));
    document.getElementById("cvPaper").classList.toggle("page-border", data.pageBorder === true);

    setBlock("secSummary", "cvObjective", has(data.objective) ? '<p class="cv-p">' + nl2br(data.objective) + "</p>" : "");
    setBlock("secExperience", "cvExperience", experienceHTML());
    setBlock("secEducation", "cvEducation", educationHTML());
    setBlock(
      "secSkills",
      "cvSkills",
      skillsHTML()
    );
    setBlock("secProjects", "cvProjects", projectsHTML());
    setBlock("secCerts", "cvCertifications", certificationsHTML());
    setBlock(
      "secPersonal",
      "cvPersonal",
      lineList([
        ["Date of birth", data.dob],
        ["Nationality", data.nationality],
        ["Languages spoken", data.spoken],
        ["Place", data.place],
      ])
    );

    document.title = (has(data.name) ? data.name : "My CV") + " — CV";
    applyZoom();
  }

  /* ------------------------------------------------------------------ */
  /* edit panel                                                          */
  /* ------------------------------------------------------------------ */
  function buildForm() {
    var host = document.getElementById("editForm");
    host.innerHTML = FIELDS.map(function (group) {
      if (group.repeatable) {
        var repeat = group.repeatable;
        var items = data[repeat.key] || [];
        var cards = items.map(function (item, index) {
          var fields = repeat.fields.map(function (f) {
            var control = f.type === "textarea" ? '<textarea rows="3"></textarea>' : '<input type="text">';
            return '<label class="field' + (f.full ? " full" : "") + '"><span>' + f.label + '</span>' + control + '</label>';
          }).join("");
          return '<div class="repeat-card" data-repeat-key="' + repeat.key + '" data-repeat-index="' + index + '"><div class="repeat-card-head"><strong>' + repeat.title + ' ' + (index + 1) + '</strong><button type="button" class="remove-repeat" data-repeat-key="' + repeat.key + '" data-repeat-index="' + index + '">Remove</button></div><div class="fields">' + fields + '</div></div>';
        }).join("");
        return '<section class="group"><h3>' + group.title + '</h3>' + (group.hint ? '<p class="group-hint">' + group.hint + '</p>' : '') + '<div class="repeat-list">' + cards + '</div><button type="button" class="add-repeat" data-repeat-key="' + repeat.key + '">+ Add another ' + repeat.title + '</button></section>';
      }
      var fields = group.fields
        .map(function (f) {
          var control =
            f.type === "file"
              ? '<input data-key="' + f.key + '" type="file" accept="image/*">'
              : f.type === "checkbox"
              ? '<input data-key="' + f.key + '" type="checkbox">'
              : f.type === "textarea"
              ? '<textarea data-key="' + f.key + '" rows="3"></textarea>'
              : '<input data-key="' + f.key + '" type="' + (f.type || "text") + '">';
          return '<label class="field' + (f.full ? " full" : "") + '"><span>' + f.label + "</span>" + control + "</label>";
        })
        .join("");
      return (
        '<section class="group">' +
          "<h3>" + group.title + "</h3>" +
          (group.hint ? '<p class="group-hint">' + group.hint + "</p>" : "") +
          '<div class="fields">' + fields + "</div>" +
        "</section>"
      );
    }).join("");

    host.querySelectorAll("[data-key]").forEach(function (el) {
      if (el.type === "checkbox") el.checked = data[el.dataset.key] === true;
      else if (el.type !== "file") el.value = has(data[el.dataset.key]) ? data[el.dataset.key] : "";
      el.addEventListener("input", function () {
        if (el.type === "file") {
          var file = el.files && el.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            data[el.dataset.key] = reader.result;
            saveData();
            renderCV();
          };
          reader.readAsDataURL(file);
          return;
        }
        data[el.dataset.key] = el.type === "checkbox" ? el.checked : el.value;
        saveData();
        renderCV();
      });
    });

    host.querySelectorAll(".repeat-card").forEach(function (card) {
      var key = card.dataset.repeatKey;
      var index = Number(card.dataset.repeatIndex);
      card.querySelectorAll("input, textarea").forEach(function (el, fieldIndex) {
        var field = FIELDS.filter(function (group) { return group.repeatable && group.repeatable.key === key; })[0].repeatable.fields[fieldIndex];
        el.value = has(data[key][index][field.key]) ? data[key][index][field.key] : "";
        el.addEventListener("input", function () {
          data[key][index][field.key] = el.value;
          saveData();
          renderCV();
        });
      });
    });
    host.querySelectorAll(".add-repeat").forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.dataset.repeatKey;
        var repeat = FIELDS.filter(function (group) { return group.repeatable && group.repeatable.key === key; })[0].repeatable;
        var empty = {};
        repeat.fields.forEach(function (field) { empty[field.key] = ""; });
        data[key].push(empty);
        saveData();
        buildForm();
      });
    });
    host.querySelectorAll(".remove-repeat").forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.dataset.repeatKey;
        data[key].splice(Number(button.dataset.repeatIndex), 1);
        saveData();
        buildForm();
        renderCV();
      });
    });
  }

  function openEdit() {
    document.getElementById("editPanel").classList.add("open");
    document.getElementById("editPanel").setAttribute("aria-hidden", "false");
    document.getElementById("backdrop").classList.add("open");
  }

  function closeEdit() {
    document.getElementById("editPanel").classList.remove("open");
    document.getElementById("editPanel").setAttribute("aria-hidden", "true");
    document.getElementById("backdrop").classList.remove("open");
  }

  /* ------------------------------------------------------------------ */
  /* zoom                                                                */
  /* ------------------------------------------------------------------ */
  function fitZoom() {
    var stage = document.getElementById("stage");
    var avail = stage.clientWidth - 48;
    zoom = Math.min(1, Math.max(0.35, avail / 794));
  }

  function applyZoom() {
    var paper = document.getElementById("cvPaper");
    var wrap = document.getElementById("paperWrap");
    paper.style.transform = "scale(" + zoom + ")";
    wrap.style.width = Math.round(794 * zoom) + "px";
    wrap.style.height = Math.round(paper.offsetHeight * zoom) + "px";
    document.getElementById("zoomValue").textContent = Math.round(zoom * 100) + "%";
  }

  function setZoom(next) {
    autoZoom = false;
    zoom = Math.min(1.5, Math.max(0.35, next));
    applyZoom();
  }

  /* ------------------------------------------------------------------ */
  /* download                                                            */
  /* ------------------------------------------------------------------ */
  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  var prevTitle = null;

  function downloadPDF() {
    prevTitle = document.title;
    document.title = fileName();
    window.print();
  }

  window.addEventListener("afterprint", function () {
    if (prevTitle) {
      document.title = prevTitle;
      prevTitle = null;
    }
  });

  function downloadImage(format) {
    var paper = document.getElementById("cvPaper");
    var css = document.getElementById("cvStyle").textContent;
    var W = 794;
    var H = Math.max(1123, paper.offsetHeight);

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '">' +
        "<style>" + css + "</style>" +
        '<foreignObject x="0" y="0" width="' + W + '" height="' + H + '">' +
          '<div xmlns="http://www.w3.org/1999/xhtml" class="cv-paper" style="width:' + W + "px;min-height:" + H + 'px">' +
            paper.innerHTML +
          "</div>" +
        "</foreignObject>" +
      "</svg>";

    var img = new Image();
    img.onload = function () {
      var scale = 2;
      var canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = H * scale;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        function (blob) {
          if (blob) saveBlob(blob, fileName() + (format === "jpg" ? ".jpg" : ".png"));
          else alert("Image export failed. Please use Download PDF instead.");
        },
        format === "jpg" ? "image/jpeg" : "image/png",
        0.95
      );
    };
    img.onerror = function () {
      alert("Sorry, image export is not supported in this browser. Please use Download PDF instead.");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ------------------------------------------------------------------ */
  /* wiring                                                              */
  /* ------------------------------------------------------------------ */
  function wire() {
    var menu = document.getElementById("downloadMenu");
    var dlBtn = document.getElementById("downloadBtn");

    dlBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle("open");
      dlBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !e.target.closest("#downloadBtn")) {
        menu.classList.remove("open");
        dlBtn.setAttribute("aria-expanded", "false");
      }
    });

    menu.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        menu.classList.remove("open");
        dlBtn.setAttribute("aria-expanded", "false");
        var format = btn.dataset.format;
        if (format === "pdf") downloadPDF();
        else downloadImage(format);
      });
    });

    document.getElementById("editBtn").addEventListener("click", openEdit);
    document.getElementById("closeEdit").addEventListener("click", closeEdit);
    document.getElementById("backdrop").addEventListener("click", closeEdit);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeEdit();
        menu.classList.remove("open");
      }
    });

    document.getElementById("zoomIn").addEventListener("click", function () {
      setZoom(zoom + 0.1);
    });
    document.getElementById("zoomOut").addEventListener("click", function () {
      setZoom(zoom - 0.1);
    });

    document.getElementById("resetBtn").addEventListener("click", function () {
      if (!confirm("Reset the CV to its original details?")) return;
      data = {};
      for (var k in defaultData) data[k] = defaultData[k];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* ignore */
      }
      buildForm();
      saveData();
      renderCV();
    });

    window.addEventListener("resize", function () {
      if (autoZoom) fitZoom();
      applyZoom();
    });
  }

  /* ------------------------------------------------------------------ */
  buildForm();
  wire();
  fitZoom();
  renderCV();
})();
