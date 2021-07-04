{
  "targets": [
    {
      "target_name": "getrusage",
      "sources": [
        "getrusage.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
