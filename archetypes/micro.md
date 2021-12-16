---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: "{{ lower (replace .Name "-" "-" | title) }}"
type: micro
target: ''
bookmark: false
reply: false
like: false
note: false
event: false
category: 'music'
---
