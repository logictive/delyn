---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
subtitle: ""
seoTitle: "{{ replace .TranslationBaseName "-" " " | title }}"
seoDescription: ""
date: {{ .Date }}
draft: true
menu: "main"
url: "/{{ .TranslationBaseName | urlize }}"

# Landing Page Banner
banner:
  enabled: false
  title: ""
  text: ""
  primaryAction:
    text: ""
    url: ""
  secondaryAction:
    text: ""
    url: ""
---