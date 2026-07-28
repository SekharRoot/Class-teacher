import re

with open("src/components/admin/DatabasesTab.tsx", "r") as f:
    content = f.read()

start_marker = "  // Multiple database / cross-database migration state"
end_marker = "return ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

replacement = """  const {
    configDbs,
    sourceDbId, setSourceDbId,
    targetDbId, setTargetDbId,
    isTransferring,
    transferProgress,
    transferStatus,
    transferLog,
    transferSuccess,
    transferError,
    transferOptions, setTransferOptions,
    handleTransfer
  } = useCrossDatabaseMigration();

  """

new_content = content[:start_idx] + replacement + content[end_idx:]

with open("src/components/admin/DatabasesTab.tsx", "w") as f:
    f.write(new_content)
