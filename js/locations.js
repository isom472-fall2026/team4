function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
  messageEl.hidden = false;
}

function clearMessage() {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  messageEl.textContent = '';
  messageEl.className = 'message';
  messageEl.hidden = true;
}

document.addEventListener('DOMContentLoaded', async () => {
  const profile = await requireAdmin();
  if (!profile) return;

  const locationsCard = document.getElementById('locations-card');
  if (locationsCard) {
    locationsCard.hidden = false;
  }

  async function handleLogout() {
    const client = window.supabaseClient || window.supabase;
    if (client && client.auth) {
      await client.auth.signOut();
    }
    window.location.href = 'login.html';
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  const client = window.supabaseClient || window.supabase;
  if (!client) {
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  async function loadLocations() {
    const container = document.getElementById('locations-container');
    if (!container) return;

    try {
      const { data: locations, error: fetchError } = await client
        .from('campus_locations')
        .select('location_id, name, building')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (fetchError) {
        showMessage(fetchError.message || 'Failed to load locations.', 'error');
        return;
      }

      container.innerHTML = '';

      if (!locations || locations.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'card-desc';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.marginTop = '1.5rem';
        emptyMsg.textContent = 'No active locations.';
        container.appendChild(emptyMsg);
        return;
      }

      const tableWrapper = document.createElement('div');
      tableWrapper.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.className = 'locations-table';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Name', 'Building', 'Action'].forEach((headingText) => {
        const th = document.createElement('th');
        th.textContent = headingText;
        if (headingText === 'Action') {
          th.style.textAlign = 'right';
        }
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      locations.forEach((loc) => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = loc.name;
        tr.appendChild(tdName);

        const tdBuilding = document.createElement('td');
        tdBuilding.textContent = loc.building;
        tr.appendChild(tdBuilding);

        const tdAction = document.createElement('td');
        tdAction.style.textAlign = 'right';

        const deactivateBtn = document.createElement('button');
        deactivateBtn.type = 'button';
        deactivateBtn.className = 'btn-deactivate';
        deactivateBtn.textContent = 'Deactivate';

        deactivateBtn.addEventListener('click', async () => {
          clearMessage();
          deactivateBtn.disabled = true;

          try {
            const { error: updateError } = await client
              .from('campus_locations')
              .update({ is_active: false })
              .eq('location_id', loc.location_id);

            if (updateError) {
              showMessage(updateError.message || 'Failed to deactivate location.', 'error');
              deactivateBtn.disabled = false;
              return;
            }

            showMessage('Location deactivated.', 'success');
            await loadLocations();
          } catch (err) {
            showMessage(err.message || 'An unexpected error occurred.', 'error');
            deactivateBtn.disabled = false;
          }
        });

        tdAction.appendChild(deactivateBtn);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrapper.appendChild(table);
      container.appendChild(tableWrapper);
    } catch (err) {
      showMessage(err.message || 'Failed to load locations.', 'error');
    }
  }

  await loadLocations();

  const form = document.getElementById('location-form');
  const saveBtn = document.getElementById('save-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const nameInput = document.getElementById('name');
    const buildingInput = document.getElementById('building');

    const name = nameInput ? nameInput.value.trim() : '';
    const building = buildingInput ? buildingInput.value.trim() : '';

    if (!name || !building) {
      showMessage('Please fill in the name and the building.', 'error');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    try {
      const { data: existing, error: checkError } = await client
        .from('campus_locations')
        .select('location_id')
        .ilike('name', name)
        .ilike('building', building);

      if (checkError) {
        showMessage(checkError.message || 'An error occurred while checking locations.', 'error');
        return;
      }

      if (existing && existing.length > 0) {
        showMessage('This location already exists.', 'error');
        return;
      }

      const { error: insertError } = await client
        .from('campus_locations')
        .insert({
          name: name,
          building: building
        });

      if (insertError) {
        showMessage(insertError.message || 'An error occurred while saving the location.', 'error');
        return;
      }

      showMessage('Location saved.', 'success');
      form.reset();
      if (nameInput) nameInput.value = '';
      if (buildingInput) buildingInput.value = '';
      await loadLocations();
    } catch (err) {
      showMessage(err.message || 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  });
});
