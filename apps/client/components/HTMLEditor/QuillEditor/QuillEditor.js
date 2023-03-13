import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4, width: "100%" }}>
      <CircularProgress />
    </Box>
  ),
});

const Quill = dynamic(() => import("react-quill")).then(({ Quill }) => Quill);

const MODULES = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote", "hr"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      hr: function () {
        const cursorPosition = this.quill.getSelection().index;

        this.quill.clipboard.dangerouslyPasteHTML(cursorPosition, "<hr>");
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

const FORMATS = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "formats/hr",
  "hr",
];

let BlockEmbed = Quill.import("blots/block/embed");

let icons = Quill.import("ui/icons");

icons["hr"] = `<svg viewBox="0 0 52 52">
<path class="ql-fill" d="M52,26c0,2.476-0.213,4.483-2.69,4.483H2.69C0.213,30.483,0,28.476,0,26s0.213-4.483,2.69-4.483
  h46.62C51.787,21.517,52,23.524,52,26z" />
</svg>`;

class Hr extends BlockEmbed {
  static create(value) {
    let node = super.create(value);

    return node;
  }
}

Hr.blotName = "hr";
Hr.tagName = "hr";

Quill.register({
  "formats/hr": Hr,
});

export default function ReactQuillCustom(props) {
  const { onChange, value, label, editorRef, ...other } = props;

  return (
    <ReactQuill
      {...other}
      defaultValue={value}
      modules={MODULES}
      formats={FORMATS}
      ref={editorRef}
      theme={"snow"}
      onChange={onChange}
    />
  );
}
