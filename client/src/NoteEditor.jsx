import { useState, useEffect } from 'react'
import { updateNote } from './api'
import styles from './NoteEditor.module.css'

const NoteEditor = ({ note, onContentChange, onTitleChange }) => {
  const content = note.content ?? ''
  const title = note.title ?? ''

  const [lastSavedContent, setLastSavedContent] = useState(content)
  const [lastSavedTitle, setLastSavedTitle] = useState(title)

  const [saveError, setSaveError] = useState(false)
  const [titleSaveError, setTitleSaveError] = useState(false)

  useEffect(() => {
    if (content === lastSavedContent) return

    const timerId = setTimeout(() => {
      async function save() {
        try {
          setSaveError(false)
          await updateNote(note.id, { content })
          setLastSavedContent(content)
        } catch {
          setSaveError(true)
        }
      }
      save()
    }, 500)

    return () => clearTimeout(timerId)
  }, [content, note.id, lastSavedContent])

  useEffect(() => {
    if (title === lastSavedTitle) return

    const timerId = setTimeout(() => {
      async function save() {
        try {
          setTitleSaveError(false)
          await updateNote(note.id, { title })
          setLastSavedTitle(title)
        } catch {
          setTitleSaveError(true)
        }
      }
      save()
    }, 500)

    return () => clearTimeout(timerId)
  }, [title, note.id, lastSavedTitle])

  const unsaved = content !== lastSavedContent
  const unsavedTitle = title !== lastSavedTitle

  return (
    <article className={styles.editor}>
      <div className={styles.column}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <p className="label-14 text-muted">
              {titleSaveError ? 'Couldn\'t save your title' : unsavedTitle ? 'Saving title...' : 'Saved title'}
            </p>
            <input
              value={title}
              className={`heading-32 ${styles.title}`}
              maxLength={50}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <p className="label-14 text-muted">
            {saveError ? 'Couldn\'t save your content' : unsaved ? 'Saving note content...' : 'Saved note content'}
          </p>
        </header>
        <textarea
          autoFocus
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className={`copy-16 ${styles.body}`}
        />
      </div>
    </article>
  )
}

export default NoteEditor
