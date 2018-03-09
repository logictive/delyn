---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
menu: "main"
url: "/{{ .TranslationBaseName | urlize }}"
---