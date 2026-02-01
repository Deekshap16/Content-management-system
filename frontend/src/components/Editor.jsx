import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Editor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      }}
    />
  );
}

export default Editor;