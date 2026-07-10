<script>
  // A small reusable "are you sure?" dialog. The parent controls visibility
  // with `open` and reacts to the two callback props.
  //
  //   <ConfirmModal
  //     open={showModal}
  //     title="Log out?"
  //     message="You'll need to sign back in."
  //     confirmText="Log out"
  //     onconfirm={doLogout}
  //     oncancel={() => (showModal = false)}
  //   />
  let {
    open = false,
    title = "Are you sure?",
    message = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    onconfirm,
    oncancel,
  } = $props();
</script>

<svelte:window
  onkeydown={(e) => open && e.key === "Escape" && oncancel?.()}
/>

{#if open}
  <!-- Backdrop: a click on the backdrop itself (not the dialog) cancels. -->
  <div
    class="backdrop"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && oncancel?.()}
  >
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabindex="-1"
    >
      <h2>{title}</h2>
      {#if message}
        <p>{message}</p>
      {/if}
      <div class="actions">
        <button type="button" class="cancel" onclick={oncancel}>
          {cancelText}
        </button>
        <button
          type="button"
          class="confirm"
          class:danger
          onclick={onconfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .dialog {
    width: 100%;
    max-width: 360px;
    padding: 1.5rem;
    border-radius: 12px;
    background-color: var(--panel-color);
    color: var(--text-color);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  }

  h2 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0 0 1.25rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  button {
    padding: 0.55rem 1rem;
    border-radius: 6px;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
  }

  .cancel {
    background-color: transparent;
    border: 1px solid var(--text-color);
    color: var(--text-color);
  }

  .confirm {
    background-color: var(--accent-color);
    color: #fff;
  }

  .confirm.danger {
    background-color: #b00020;
  }
</style>
